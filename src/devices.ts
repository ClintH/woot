import { someFilterMatch } from "./filter";
import type { Device, DeviceKinds, DevicesOptions, DevicesScanOptions } from "./types";
import { RgbDevice, RgbDeviceKind } from "./device-rgb";
import { AnalogDevice, AnalogDeviceKind } from "./device-analog";


/**
 * Create and attempt to create to devices previously paired with that match filter
 * 
 * ```js
 * const d = new Devices();
 * await d.initialise();
 * ```
 * 
 * By default tries to connect to Wooting RGB 'usage pages', not analog input. 
 * To get this input:
 * 
 * ```js
 * const d = new Devices({ analog: true });
 * ```
 * 
 * Or to not use RGB:
 * 
 * ```js
 * const d = new Devices({ rgb: false, analog: true });
 * ```
 */
export class Devices {
  devices: Device[] = [];
  #initialised = false;
  #kinds: DeviceKinds[] = [];
  #options: DevicesOptions;

  constructor(options: Partial<DevicesOptions> = {}) {
    this.#options = {
      rgb: true,
      analog: false,
      ...options
    }
    if (this.#options.rgb) this.#kinds.push(new RgbDeviceKind());
    if (this.#options.analog) this.#kinds.push(new AnalogDeviceKind());
  }

  /**
   * Scans and attempts to connect to all recognised Wooting devices.
   * By default returns last scan results unless `force:true`.
   * 
   * Internally calls {@link closeAll} first.
   * @returns 
   */
  async scan(options: Partial<DevicesScanOptions> = {}) {
    const opts: DevicesScanOptions = {
      force: false,
      automaticallyConnect: true,
      ...options
    }
    if (this.devices.length > 0 && !opts.force) return this.devices;
    if (!("hid" in navigator)) throw new Error(`WebHID not supported`);

    this.closeAll();

    for (const k of this.#kinds) {
      const foundDevices = await navigator.hid.requestDevice({
        filters: k.filters,
      });
      if (opts.automaticallyConnect) {
        this.#connectDevices(foundDevices, k);
      }
    }
    return this.devices;
  }

  async #connectDevices(devices: HIDDevice[], k: DeviceKinds) {
    const filtered = devices.filter(d => {
      const r = someFilterMatch(d, k.filters);
      return r.success;
    });

    for (const d of filtered) {
      const result = k.create(d);
      if (result.success) {
        if (!d.opened) {
          await d.open();
        }
        this.devices.push(result.value);
      }
    }
  }

  /**
   * Prints current devices to console
   */
  debugDump() {
    for (const d of this.devices) {
      console.log(`${ d.kind }\t${ d.printableId }`);
    }
  }

  /**
   * Attempts to reconnect to previously paired devices.
   * 
   * If `initialise()` has already been run, it exits early.
   * 
   * @returns 
   */
  async initialise() {
    if (this.#initialised) return;
    this.#initialised;
    const devices = await navigator.hid.getDevices();
    for (const k of this.#kinds) {
      await this.#connectDevices(devices, k);
    }
  }

  /**
   * Enumerates all filters over all device kinds
   */
  *filtersCombined() {
    for (const k of this.#kinds) {
      yield* k.filters;
    }
  }

  /**
   * Enumerates all the RGB devices
   */
  *getRgb() {
    for (const d of this.devices) {
      if (d instanceof RgbDevice) yield d as RgbDevice;
    }
  }

  /**
   * Enumerates all the analog input devices
   */
  *getAnalog() {
    for (const d of this.devices) {
      if (d instanceof AnalogDevice) yield d as AnalogDevice;
    }
  }

  /**
   * Closes all devices, and empties the device array
   */
  closeAll() {
    for (const d of this.devices) {
      d.close();
    }
    this.devices = [];
  }
}