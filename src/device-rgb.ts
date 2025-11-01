import type { Rgb, KeyboardInfo, MatrixPosition, Result, DeviceKinds } from "./types";
import * as C from './magic-numbers';
import * as Packing from './packing';
import * as Colour from './util/colour';
import { someFilterMatch } from "./filter";
import { DeviceBase } from "./device-base";
import { failOnError } from "./util/results";

export class RgbDevice extends DeviceBase {
  #ledBuffer: Rgb[][];
  #bufferDirty = false;

  /**
   * Create an RGB device for a given HIDDevice instance.
   * 
   * Tries to look up correct {@link KeyboardInfo} automatically, but otherwise
   * provide it as the `info` parameter.
   * @param device 
   * @param kind 
   * @param info 
   */
  constructor(device: HIDDevice, kind: DeviceKinds, info?: KeyboardInfo) {
    super(device, kind, info);

    // Initialise empty buffer
    this.#ledBuffer = [];
    for (let i = 0; i < this._info.rows; i++) {
      this.#ledBuffer.push(new Array<Rgb>(this._info.columns));
    }
  }


  /**
   * Validates a row/col position, returning the row data for this position
   * @param pos 
   * @returns 
   */
  validateRowCol(row: number, column: number): Result<Rgb[]> {
    if (row >= this.#ledBuffer.length) return { success: false, reason: `Row out of range, max index should be: ${ this.#ledBuffer.length - 1 }. Got: ${ row }` };
    const rData = this.#ledBuffer[ row ];
    if (column >= rData.length) return { success: false, reason: `Column of of range, max index should be: ${ column }. Got: ${ column }` };
    return { success: true, value: rData }
  }

  /**
   * Sets an RGB value at a specified position.
   * Value is buffered, use {@link flushRgbBuffer} to send to keyboard.
   * 
   * RGB values should be in 0..255 range for each colour component.
   * @param row 
   * @param column 
   * @param rgb 
   */
  setRgb(pos: MatrixPosition, rgb: Rgb) {
    const r = this.validateRowCol(pos.row, pos.column);
    if (r.success) {
      r.value[ pos.column ] = rgb;
      this.#bufferDirty = true;
    } else {
      failOnError(r);
    }
  }

  /**
   * As {@link setRgb} but each parameter is a simple number. Calls {@link setRgb} under-the-hood
   * @param row 
   * @param column 
   * @param r 
   * @param g 
   * @param b 
   */
  setRgbAlt(row: number, column: number, r: number, g: number, b: number) {
    this.setRgb({ row, column }, { r, g, b });
  }

  /**
   * Sends out the current RGB buffer.
   * 
   * Skips writing if the buffer hasn't changed since last flush. Use `force` to override this.
   * @param force If _true_, buffer is written regardless of whether it seems buffer hasn't changed.
   * @returns 
   */
  flushRgbBuffer(force = false) {
    if (!force && !this.#bufferDirty) return; // Nothing to do
    const rows = this.#ledBuffer.map(row => {
      const r = row.map(colour => {
        const as16 = Colour.encodeRgb(colour);
        return [ as16 & 0xff, as16 >> 8 ];
      });
      return r.flat();
    });
    this.#bufferDirty = false; // Assume it worked out

    return this.#sendRgbBuffer(rows);
  }

  /**
   * Sets a single key colour.
   * 
   * If many keys need to be changed, it would be better to use {@link setRgb} which
   * buffers data to send in one batch.
   * 
   * Note: this does not update or invalidate the buffered data.
   * @param pos 
   * @param rgb 
   * @returns 
   */
  setRgbSingle(pos: MatrixPosition, rgb: Rgb) {
    const position = Packing.packPosition(pos);
    return this.sendFeature(
      C.WOOTING_SINGLE_COLOR_COMMAND,
      rgb.b, rgb.g, rgb.r, position);
  }

  // get_safe_led_idex(pos: MatrixPosition) {
  //   if (pos.row < this.#meta.max_rows && pos.column < this.#meta.max_columns) {
  //     return C.rgb_led_indexes[ pos.row ][ pos.column ];
  //   } else {
  //     return C.NOLED;
  //   }
  // }


  /**
   * Resets the colour for a single key.
   * 
   * Use {@link resetAll} to reset all keys.
   * 
   * @param pos 
   * @returns 
   */
  resetSingle(pos: MatrixPosition) {
    const position = Packing.packPosition(pos);
    return this.sendFeature(C.WOOTING_SINGLE_RESET_COMMAND, position, 0, 0, 0);
  }

  /**
   * Resets the colour for all keys and signals that the
   * keyboard should resume it's usual behaviour. This is needed for Wootility to 
   * control the keyboard again.
   */
  resetAll() {
    this.sendFeature(C.WOOTING_RESET_ALL_COMMAND, 0, 0, 0, 0);
  }

  #sendRgbBuffer(rgb: number[][]) {
    if (!this.isOpen) throw new Error(`Device not open`);
    const buffer = new Uint8Array(256);
    const colours = rgb.flat();
    buffer[ 0 ] = 0xD0;
    buffer[ 1 ] = 0xDA;
    buffer[ 2 ] = C.WOOTING_RAW_COLORS_REPORT;
    buffer.set(colours, 3);
    return this._device.sendReport(0, buffer);
  }

  /**
   * Enumerates {row,column} positions row-wise (ie scanning left to right per row)
   */
  *keysByRow() {
    for (let row = 0; row < this.rowCount; row++) {
      for (let column = 0; column < this.columnCount; column++) {
        yield { row, column }
      }
    }
  }

  /**
   * Enumerates {row,column} positions column-wise (ie scanning top-to-bottom per column)
   */
  *keysByColumn() {
    for (let column = 0; column < this.columnCount; column++) {
      for (let row = 0; row < this.rowCount; row++) {
        yield { row, column }
      }
    }
  }

  /**
   * Gets the number of rows
   */
  get rowCount() {
    return this.info.rows;
  }

  /**
   * Gets the number of columns
   */
  get columnCount() {
    return this.info.columns;
  }
}

export class RgbDeviceKind implements DeviceKinds {
  /**
   * The filters used to determine whether a HIDDevice is supported for RGB control
   */
  filters: HIDDeviceFilter[] = [
    { usagePage: C.CFG_USAGE_PAGE, vendorId: C.VID },
    // From AnalogSense.js
    //{ usagePage: 0xFF54, vendorId: 0x31E3 },
    //{ usagePage: 0xFF54, vendorId: 0x03EB, productId: 0xFF01 }, // Wooting One with old firmware
    //{ usagePage: 0xFF54, vendorId: 0x03EB, productId: 0xFF02 }, // Wooting Two with old firmware
  ]

  /**
   * Attempts to create a {@link RgbDevice} instance for a give HIDDevice. Returns a
   * error result if the device does not match the necessary filter parameters.
   * @param dev 
   * @returns 
   */
  create(dev: HIDDevice): Result<RgbDevice> {
    const r = someFilterMatch(dev, this.filters);
    if (r.success) {
      return { success: true, value: new RgbDevice(dev, this) }
    }
    return r;
  }

  /**
   * Returns 'Rgb'
   */
  get name() {
    return `Rgb`;
  }

}