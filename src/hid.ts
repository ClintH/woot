export function hidDebugString(device: HIDDevice) {
  return `'${ device.productName }' vid: ${ device.vendorId.toString(16) } pid: ${ device.productId.toString(16) }`;
}
