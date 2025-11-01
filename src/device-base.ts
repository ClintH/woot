import { hidDebugString } from "./hid";
import { type DeviceKinds, type KeyboardInfo, } from "./types";
import * as Info from "./keyboard-info";
import * as Packing from './packing';

export abstract class DeviceBase {
  protected _device: HIDDevice;
  protected _info: KeyboardInfo;
  #kind: DeviceKinds;

  constructor(device: HIDDevice, kind: DeviceKinds, info?: KeyboardInfo) {
    this._device = device;
    this.#kind = kind;

    // Attempt to resolve the right metadata
    if (!info) {
      this._info = Info.pidToInfo[ device.productId & 0xFFF0 ];
    } else {
      this._info = info;
    }
    if (!this._info) throw new Error(`Unknown product: ${ hidDebugString(device) }`);

    // Apologies...
    if (this._info.smallPackets) {
      console.warn(`Small packet size transfers are not supported - I don't have a keyboard to test with. Sorry.`);
    }
    if (!this._info.v2) {
      throw new Error(`Pre-version 2 devices are not supported - I don't have a keyboard to test with. Sorry.`);
    }

  }

  /**
   * Sends a command to the device in the form:
   * ```js
   * [
   *  0xD0, 0xDA // Magic words
   *  commandId,
   *  param1, param2, param3, param4
   * ]
   * ```
   * 
   * Throws an error if any parameter is outside of Uint8 range.
   * @param commandId 
   * @param param1 Uint8 0..255 value
   * @param param2 Uint8 0..255 value
   * @param param3 Uint8 0..255 value
   * @param param4 Uint8 0..255 value
   * @returns 
   */
  sendFeature(commandId: number, param1: number, param2: number, param3: number, param4: number) {
    if (!this.isOpen) throw new Error(`Device not open`);
    Packing.throwIfUint8Range(param1, param2, param3, param4);
    const buffer = Uint8Array.from([
      0xD0, 0xDA, // Magic words
      commandId,
      param1, param2, param3, param4
    ]);
    return this._device.sendFeatureReport(0, buffer);
  }

  /**
   * Closes the underlying WebHID HIDDevice instance
   * @returns 
   */
  close() {
    return this._device.close();
  }

  get device() {
    return this._device;
  }

  get printableId() {
    return hidDebugString(this._device);
  }

  get isOpen(): boolean {
    return this._device.opened;
  }

  get info() {
    return this._info;
  }

  get kind() {
    return this.#kind;
  }
}