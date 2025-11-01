import type { Rgb } from "../types";

export function hexToRgb(hex: string): Rgb {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) throw new Error(`Hex code invalid`);

  return {
    r: parseInt(result[ 1 ], 16),
    g: parseInt(result[ 2 ], 16),
    b: parseInt(result[ 3 ], 16)
  }
}

/**
 * Encode an 8-bit RGB value in reduced-depth, 16-bit integer.
 * @param rgb 
 * @returns 
 */
export function encodeRgb(rgb: Rgb) {
  // let encode = 0;

  // encode |= (rgb.r & 0xf8) << 8;
  // encode |= (rgb.g & 0xfc) << 3;
  // encode |= (rgb.b & 0xf8) >> 3;

  //              248                    252                  248
  return (rgb.r & 0xf8) << 8 | (rgb.g & 0xfc) << 3 | (rgb.b & 0xf8) >> 3;
}

/**
 * Decodes a 16-bit colour into RGB colour.
 * Some resolution is lost, so RGB will never be 'full' 0..255 range.
 * @param colour 
 * @returns 
 */
export function decodeRgb(colour: number): Rgb {
  return {
    r: (colour >> 8) & 0xf8,
    g: (colour >> 3) & 0xfc,
    b: (colour << 3) & 0xf8
  }
}