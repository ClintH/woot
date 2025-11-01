import { hexToRgb } from '../src/util/colour';
import { Devices } from '../src/devices'
import './style.css'
import type { Device, MatrixPosition, Rgb } from '../src/types';
import type { AnalogDeviceInputEvent } from '../src';

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const basicColours = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 127, g: 127, b: 0 },
  { r: 0, g: 127, b: 127 },
  { r: 127, g: 0, b: 127 },
] as const;

const d = new Devices({ rgb: true, analog: true });
await d.initialise();

/**
 * Set all keys in a row the same colour
 * @param wd 
 */
async function demoBuffered() {
  const rgb = [ ...d.getRgb() ];
  if (rgb.length === 0) {
    alert(`No RGB devices found`);
    return;
  }
  const wd = rgb[ 0 ];

  console.log(`Demo buffered output: ${ wd.printableId }`);

  for (const key of wd.keysByRow()) {
    wd.setRgb(key, basicColours[ key.row % basicColours.length ]);
  }
  wd.flushRgbBuffer();

  await sleep(2000);
  for (const key of wd.keysByColumn()) {
    wd.setRgb(key, basicColours[ key.column % basicColours.length ]);
  }
  wd.flushRgbBuffer();


  setTimeout(() => {
    wd.resetAll();
  }, 5000);
}

async function demoSingle(pos: MatrixPosition, colour: Rgb) {
  const rgb = [ ...d.getRgb() ];
  if (rgb.length === 0) {
    alert(`No RGB devices found`);
    return;
  }
  const wd = rgb[ 0 ];

  console.log(`Demo single output: ${ wd.printableId } pos: ${ pos.row }x${ pos.column } colour: ${ colour.r },${ colour.g },${ colour.b }`);

  wd.setRgbSingle(pos, colour);

  setTimeout(() => {
    wd.resetAll();
  }, 5000);
}

function onPostScanOrInit(devices: Device[]) {
  const el = document.querySelector(`#scanResults`) as HTMLElement;

  if (devices.length === 0) {
    el.innerHTML = `No devices found.`;
    return;
  } else {
    let txt = d.devices.map(d => `<li>${ d.printableId } (${ d.kind.name })</li>`).join(``);
    el.innerHTML = `<ul>${ txt }</ul>`;
  }
}

function setAnalogKeys(event: AnalogDeviceInputEvent) {
  const el = document.querySelector(`#keys`) as HTMLInputElement;
  if (event.keys.length === 0) {
    el.innerHTML = `<i>No keys</i>`;
  } else {
    const items = event.keys.map(key => `<li>${ key.key } (${ key.code }) = ${ key.value.toPrecision(2) }</li>`)
    el.innerHTML = `<ul>${ items.join(``) }</ul>`
  }
}

document.querySelector(`#btnScan`)?.addEventListener(`click`, async () => {
  const devices = await d.scan();
  onPostScanOrInit(devices);
  setTimeout(() => {
    demoBuffered();
  }, 200);

  for (const ai of d.getAnalog()) {
    ai.oninput = setAnalogKeys;
  }
});

document.querySelector(`#btnDemoBuffered`)?.addEventListener(`click`, async () => {
  await d.scan();
  demoBuffered();
});

document.querySelector(`#btnDemoSingle`)?.addEventListener(`click`, async (event) => {
  await d.scan();
  demoSingleFromForm();
  event.preventDefault();
});

document.querySelector(`#btnReset`)?.addEventListener(`click`, () => {
  for (const rgb of d.getRgb()) {
    rgb.resetAll();
  }
})

document.querySelector(`#colour`)?.addEventListener(`change`, async (event) => {
  await d.scan();
  demoSingleFromForm();
  event.preventDefault();
});

document.addEventListener(`keydown`, event => {
  event.preventDefault();
  event.stopPropagation();
})

function demoSingleFromForm() {
  const pos = {
    row: (document.querySelector(`#singleRow`) as HTMLInputElement).valueAsNumber,
    column: (document.querySelector(`#singleColumn`) as HTMLInputElement).valueAsNumber,
  };
  const rgb = hexToRgb((document.querySelector(`#colour`) as HTMLInputElement).value);
  demoSingle(pos, rgb);
}

onPostScanOrInit(d.devices);