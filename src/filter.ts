import type { Result } from "./types";

/**
 * Checks if a HIDDevice matches a filter
 * @param dev 
 * @param f 
 * @returns 
 */
export function filterMatch(dev: HIDDevice, f: HIDDeviceFilter): Result<HIDDeviceFilter> {
  let success = true;
  let reason: string[] = [];
  if (f.vendorId !== undefined) {
    if (dev.vendorId !== f.vendorId) {
      success = false;
      reason.push(`Vendor id mismatch: ${ dev.vendorId }. Expected: ${ f.vendorId }`);
    }
  }
  if (f.productId !== undefined) {
    const pid = dev.productId & 0xFFF0;
    if (pid !== f.productId) {
      success = false;
      reason.push(`Product id mismatch: ${ pid }. Expected: ${ f.productId }`);
    }
  }
  if (f.usagePage !== undefined) {
    const pages = dev.collections.map(c => c.usagePage);
    const foundPage = pages.find(c => c === f.usagePage);
    if (!foundPage) {
      success = false;
      reason.push(`Usage page mismatch: ${ pages.join() }. Expected: ${ f.usagePage }`);
    }
  }
  if (success) return { success, value: f };
  return { success, reason }
}

/**
 * Returns the first filter that matches a device
 * @param dev 
 * @param filters 
 * @returns 
 */
export function someFilterMatch(dev: HIDDevice, filters: HIDDeviceFilter[]): Result<HIDDeviceFilter> {
  const reason: string[] = [];
  for (const f of filters) {
    const result = filterMatch(dev, f);
    if (result.success) return result;
    reason.push(...result.reason);
  }
  return { success: false, reason };
}