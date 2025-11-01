import { type KeyboardInfo, type Result, type DeviceKinds } from "./types";
import * as C from './magic-numbers';
import { someFilterMatch } from "./filter";
import { DeviceBase } from "./device-base";
import { keyCodeToName } from "./keys";

export type AnalogDeviceInputEvent = {
  source: AnalogDevice
  keys: {
    code: number
    value: number
    key: string | undefined
  }[]
}

export type AnalogDeviceInputHandler = (event: AnalogDeviceInputEvent) => void
export class AnalogDevice extends DeviceBase {
  oninput: AnalogDeviceInputHandler | null;

  constructor(device: HIDDevice, kind: DeviceKinds, info?: KeyboardInfo) {
    super(device, kind, info);
    this.oninput = null;
    device.oninputreport = (event) => {
      // From AnalogSense.js
      const keys = [];
      for (let i = 0; i < event.data.byteLength;) {
        const code = (event.data.getUint8(i++) << 8) | event.data.getUint8(i++);
        if (code == 0) {
          break;
        }
        const value = event.data.getUint8(i++);
        keys.push({ code, value: value / 255, key: keyCodeToName.get(code) });
      }
      if (this.oninput) {
        this.oninput({ source: this, keys })
      }
    }
  }

  close() {
    this.device.oninputreport = null;
    return super.close();
  }

}

export class AnalogDeviceKind implements DeviceKinds {
  filters: HIDDeviceFilter[] = [
    { usagePage: C.ANALOG_USAGE_PAGE, vendorId: C.VID },
  ]

  create(dev: HIDDevice): Result<AnalogDevice> {
    const r = someFilterMatch(dev, this.filters);
    if (r.success) {
      return { success: true, value: new AnalogDevice(dev, this) }
    }
    return r;
  }

  get name() {
    return `Analog`;
  }
}