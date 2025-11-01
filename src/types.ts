// export type DeviceHandlerFactory = {
//   create(dev: HIDDevice): DeviceHandler | undefined
//   get filters(): HIDDeviceFilter[]
//   get name(): string
// }

/**
 * 8-bit RGB value, where each component is 0..255 scale
 */
export type Rgb = { r: number, g: number, b: number };

export type ResultFail = { success: false, reason: string[] | string };
export type ResultOk<T> = { success: true, value: T }
export type Result<T> = ResultFail | ResultOk<T>;

export type DevicesOptions = {
  rgb: boolean
  analog: boolean
}

export type Device = {
  close(): void
  get printableId(): string
  get kind(): DeviceKinds
}

export type DevicesScanOptions = {
  force: boolean
  automaticallyConnect: boolean
}

export type Layouts = `unknown` | `ansi` | `iso`
export type DeviceType = `unknown` | `tkl` | `keyboard` | `keyboard60` | `keypad3key` | `keyboard80`

export type KeyboardInfo = Readonly<{
  model: string
  type: DeviceType,
  rows: number
  columns: number
  ledMax: number
  v2: boolean
  layout: Layouts
  smallPackets: boolean
}>

export type MatrixPosition = {
  column: number,
  row: number
}

export type DeviceKinds = {
  get filters(): HIDDeviceFilter[]
  get name(): string
  create(dev: HIDDevice): Result<Device>
}

