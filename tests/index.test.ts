import { expect, test } from 'vitest'
import * as Woot from '../src/index'


// https://www.dcode.fr/color-red-green-blue
const colours = [
  { name: `cyan`, hex: `#00FFFF`, rgb: { r: 0, g: 255, b: 255 }, bit16: 2047, rgb16: { r: 0, g: 252, b: 248 } },
  { name: `red`, hex: `ff0000`, rgb: { r: 255, g: 0, b: 0 }, bit16: 63488, rgb16: { r: 248, g: 0, b: 0 } },
  { name: `blue`, hex: `0000ff`, rgb: { r: 0, g: 0, b: 255 }, bit16: 31, rgb16: { r: 0, g: 0, b: 248 } },
  { name: `green`, hex: `00ff00`, rgb: { r: 0, g: 255, b: 0 }, bit16: 2016, rgb16: { r: 0, g: 252, b: 0 } },
  { name: `yellow`, hex: `#FFFF00`, rgb: { r: 255, g: 255, b: 0 }, bit16: 65504, rgb16: { r: 248, g: 252, b: 0 } },
  { name: `fuschia`, hex: `#FF00FF`, rgb: { r: 255, g: 0, b: 255 }, bit16: 63519, rgb16: { r: 248, g: 0, b: 248 } },
  { name: `black`, hex: `#000000`, rgb: { r: 0, g: 0, b: 0 }, bit16: 0, rgb16: { r: 0, g: 0, b: 0 } },
  { name: `white`, hex: `#FFFFFF`, rgb: { r: 255, g: 255, b: 255 }, bit16: 65535, rgb16: { r: 248, g: 252, b: 248 } },
  { name: `grey`, hex: `#7F7F7F`, rgb: { r: 127, g: 127, b: 127 }, bit16: 31727, rgb16: { r: 120, g: 124, b: 120 } }
]

test('hex-to-rgb', () => {
  for (const c of colours) {
    const parsed = Woot.hexToRgb(c.hex);
    expect(parsed).toStrictEqual(c.rgb);
  }
});

test(`rgb-coding-16-565`, () => {
  for (const c of colours) {
    const parsed = Woot.encodeRgb(c.rgb);
    expect(parsed).toStrictEqual(c.bit16);
  }

  for (const c of colours) {
    const parsed = Woot.decodeRgb(c.bit16);
    expect(parsed).toStrictEqual(c.rgb16);
  }
});