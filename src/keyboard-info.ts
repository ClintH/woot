import type { KeyboardInfo } from "./types";
import * as C from './magic-numbers';

export function createFallback(): KeyboardInfo {
  return {
    model: `N/A`,
    type: `unknown`,
    rows: 0,
    columns: 0,
    ledMax: 0,
    v2: false,
    layout: `unknown`,
    smallPackets: false
  }
}


export const wootingTwo: KeyboardInfo = {
  model: "Wooting Two",
  type: `keyboard`,
  rows: C.WOOTING_RGB_ROWS,
  columns: C.WOOTING_TWO_RGB_COLS,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: false,
  smallPackets: false,
  layout: `unknown`
}

export const wootingTwoV2: KeyboardInfo = {
  ...wootingTwo,
  v2: true
}

export const wootingTwoLe: KeyboardInfo = {
  model: "Wooting Two Lekker Edition",
  type: `keyboard`,
  rows: C.WOOTING_RGB_ROWS,
  columns: C.WOOTING_TWO_RGB_COLS,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: false,
  layout: `unknown`
}

export const wootingTwoHe: KeyboardInfo = {
  model: "Wooting Two HE",
  type: `keyboard`,
  rows: C.WOOTING_RGB_ROWS,
  columns: C.WOOTING_TWO_RGB_COLS,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: false,
  layout: `unknown`
}

export const wootingTwoHeArm: KeyboardInfo = {
  model: "Wooting Two HE (ARM)",
  type: `keyboard`,
  rows: C.WOOTING_RGB_ROWS,
  columns: C.WOOTING_TWO_RGB_COLS,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: true,
  layout: `unknown`
}

export const wooting60He: KeyboardInfo = {
  model: "Wooting 60HE",
  type: `keyboard60`,
  rows: C.WOOTING_RGB_ROWS,
  columns: 14,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: false,
  layout: `unknown`
}

export const wooting60HeArm: KeyboardInfo = {
  model: "Wooting 60HE (ARM)",
  type: `keyboard60`,
  rows: C.WOOTING_RGB_ROWS,
  columns: 14,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: true,
  layout: `unknown`
}

export const wooting60HePlus: KeyboardInfo = {
  model: "Wooting 60HE+",
  type: `keyboard60`,
  rows: C.WOOTING_RGB_ROWS,
  columns: 14,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: true,
  layout: `unknown`
}

export const wootingUwuRgb: KeyboardInfo = {
  model: "Wooting UwU RGB",
  type: `keypad3key`,
  rows: 5,
  columns: 7,
  ledMax: 18,
  v2: true,
  smallPackets: true,
  layout: `unknown`
}

export const wootingUwu: KeyboardInfo = {
  ...wootingUwuRgb,
  model: "Wooting UwU",
  ledMax: 0,
}

export const wooting80he: KeyboardInfo = {
  model: "Wooting 80HE",
  type: `keyboard80`,
  rows: C.WOOTING_RGB_ROWS,
  columns: 17,
  ledMax: C.WOOTING_TWO_KEY_CODE_LIMIT,
  v2: true,
  smallPackets: false,
  layout: `unknown`
}

export const resolveInfo: Record<number, KeyboardInfo> = {
  [ C.WOOTING_60HE_ARM_PID ]: wooting60HeArm,
  [ C.WOOTING_60HE_PID ]: wooting60He,
  [ C.WOOTING_60HE_PLUS_PID ]: wooting60HePlus,
  [ C.WOOTING_80HE_PID ]: wooting80he,
  [ C.WOOTING_TWO_HE_ARM_PID ]: wootingTwoHeArm,
  [ C.WOOTING_TWO_HE_PID ]: wootingTwo,
  [ C.WOOTING_TWO_LE_PID ]: wootingTwoLe,
  [ C.WOOTING_TWO_V2_PID ]: wootingTwoV2,
  [ C.WOOTING_UWU_PID ]: wootingUwu,
  [ C.WOOTING_UWU_RGB_PID ]: wootingUwuRgb
} as const;