# @clinth/woot

Unofficial library for modifying the RGB LEDs of a Wooting keyboard and getting analog input. It uses the WebHID API which is only available in Chrome and its derivatives.

[Demo](https://clinth.github.io/woot/)

⚠️ I only have the Wooting Two keyboard, so unsure how well it works with variants. Devices requiring small packet sizes are not supported for that reason. Happy for pull requests for to support other Wooting keyboards ⚠️ 

## Usage

```bash
npm install @clinth/woot
```

### RGB

Set up:

```js
const d = new Devices();
await d.initialise();
```


Set colours to a buffer:

```js
const wd = d.devices[0]; // Get first device

// Set the Esc key to red
wd.setRgb({ row: 0, column: 0}, { r: 255, g: 0, b: 0 });

// Or alternatively:
wd.setRgbAlt(0, 0, 255, 0, 0);
```

Write all changed keys to the keyboard:
```js
wd.flushRgbBuffer();
```

Calling `flushRgbBuffer` is a no-op if `setRgb/setRgbAlt` hasn't been called since last flush.


Set a single key, skipping the buffer:

```js
wd.setRgbSingle({ row:0, column:0 }, { r: 0, g: 255, b: 0});
```

Enumerate keys row-wise:

```js
for (const key of wd.keysByRow()) {
  wd.setRgb(key, { r: 255, g: 0, b: 0 });
}
```

...or by column:

```js
for (const key of wd.keysByColumn()) {
  wd.setRgb(key, { r: 255, g: 0, b: 0 });
}
```

Note that setting colours stops any current dynamic effect, including per-effect brightness levels. Wootility will not control the lighing of your keyboard until you release it:
```js
wd.resetAll();
```

You can also reset a single key to its default colour (as determined by saved profile):

```js
wd.resetSingle({ row:0, column: 0});
```

### Analog input

Set up:

```js
const d = new Devices({ analog: true });
await d.initialise();
```

Use the `oninput` handler to listen for key input from a device:

```js
// Get all analog input Wooting devices
for (const wd of d.getAnalog()) {
  wd.oninput = (event) => {
    console.log(`Key: ${event.key} Value: ${event.value} Code: ${event.code}`);
  }
}
```

## Demo

Starts a Vite server for the demo HTML:

```bash
npm install
npm run dev:demo
```

## Development

Install dependencies:

```bash
npm install
```

```bash
npm run build
```

## Acknowledgements

* Thanks to the Wooting Discord for help: Sainan & diogotr7.
* The [Wooting RGB SDK](https://github.com/WootingKb/wooting-rgb-sdk/) was a useful reference (MPL License, Wooting BV)
* Uses parts from the [AnalogSense.js SDK](https://github.com/AnalogSense/JavaScript-SDK) (MIT License, Calamity Inc.)