import type { MatrixPosition } from "./types";

// Thx ChatGPT
export function packPosition(pos: MatrixPosition) {
  let { row, column } = pos;

  // constrain to valid ranges (3 bits for row, 5 bits for column)
  row &= 0x07;
  column &= 0x1F;

  // pack into a single byte
  return (row << 5) | column;
}

export function unpackPosition(packedByte: number): MatrixPosition {
  const column = packedByte & 0x1F;     // lower 5 bits (0–31)
  const row = (packedByte >> 5) & 0x07; // upper 3 bits (0–7)
  return { row, column };
}

export function throwIfUint8Range(...values: number[]) {
  for (const v of values) {
    if (v < 0 || v > 255) throw new Error(`Uint8 value is 0..255. Got: ${ v }`);
  }
}