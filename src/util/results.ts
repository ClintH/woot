import type { Result } from "../types";

export function failOnError(result: Result<any>) {
  if (result.success) return;
  if (Array.isArray(result.reason)) {
    throw new Error(result.reason.join(`; `));
  }
  throw new Error(result.reason);
}
