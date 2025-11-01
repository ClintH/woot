export const CFG_USAGE_PAGE = 0x1337;
export const ANALOG_USAGE_PAGE = 0xFF54;

export const VID = 0x31E3;
export const NOLED = Number.NaN;
export const rgb_led_indexes = [
  [ 0, NOLED, 11, 12, 23, 24, 36, 47, 85, 84, 49, 48, 59, 61, 73, 81, 80, 113, 114, 115, 116 ],
  [ 2, 1, 14, 13, 26, 25, 35, 38, 37, 87, 86, 95, 51, 63, 75, 72, 74, 96, 97, 98, 99 ],
  [ 3, 4, 15, 16, 27, 28, 39, 42, 40, 88, 89, 52, 53, 71, 76, 83, 77, 102, 103, 104, 100 ],
  [ 5, 6, 17, 18, 29, 30, 41, 46, 44, 90, 93, 54, 57, 65, NOLED, NOLED, NOLED, 105, 106, 107, NOLED ],
  [ 9, 8, 19, 20, 31, 34, 32, 45, 43, 91, 92, 55, NOLED, 66, NOLED, 78, NOLED, 108, 109, 110, 101 ],
  [ 10, 22, 21, NOLED, NOLED, NOLED, 33, NOLED, NOLED, NOLED, 94, 58, 67, 68, 70, 79, 82, NOLED, 111, 112, NOLED ]
] as const;

export const WOOTING_TWO_RGB_COLS = 21;
export const WOOTING_RGB_ROWS = 6;
export const WOOTING_TWO_KEY_CODE_LIMIT = 116;
export const WOOTING_MAX_RGB_DEVICES = 10;
export const RGB_RAW_BUFFER_SIZE = 96;
export const WOOTING_RAW_COLORS_REPORT = 11
export const WOOTING_DEVICE_CONFIG_COMMAND = 19
export const WOOTING_SINGLE_COLOR_COMMAND = 30
export const WOOTING_SINGLE_RESET_COMMAND = 31
export const WOOTING_RESET_ALL_COMMAND = 32
export const WOOTING_COLOR_INIT_COMMAND = 33

export const WOOTING_ONE_PID = 0xFF01;
export const WOOTING_ONE_V2_PID = 0x1100;
export const V2_ALT_PID_0 = 0x0;
export const V2_ALT_PID_1 = 0x1;
export const V2_ALT_PID_2 = 0x2;

export const WOOTING_TWO_PID = 0xFF02;
export const WOOTING_TWO_V2_PID = 0x1200;
export const WOOTING_TWO_LE_PID = 0x1210;

export const WOOTING_TWO_HE_PID = 0x1220;
export const WOOTING_TWO_HE_ARM_PID = 0x1230;
export const WOOTING_TWO_HE_ARM_PID2 = 0x1230;

export const WOOTING_60HE_PID = 0x1300;
export const WOOTING_60HE_ARM_PID = 0x1310;
export const WOOTING_60HE_PLUS_PID = 0x1320;
export const WOOTING_UWU_PID = 0x1500;
export const WOOTING_UWU_RGB_PID = 0x1510;
export const WOOTING_80HE_PID = 0x1400;