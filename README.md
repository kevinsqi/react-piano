# react-piano

[![npm version](https://img.shields.io/npm/v/react-piano.svg)](https://www.npmjs.com/package/react-piano)
[![build status](https://travis-ci.com/iqnivek/react-piano.svg?branch=master)](https://travis-ci.com/iqnivek/react-piano)

An interactive piano keyboard for React. Supports custom sounds, touch/click/keyboard events, and fully configurable styling. [**Try it out on CodeSandbox**](https://codesandbox.io/s/7wq15pm1n1).

<a href="http://www.kevinqi.com/react-piano/"><img width="500" src="/demo/public/images/react-piano-screenshot.png" alt="react-piano screenshot" /></a>

## Installing

```
yarn add react-piano
```

Alternatively, you can download the UMD build from [unpkg](https://unpkg.com/react-piano).

## Usage

You can view or fork the [**CodeSandbox demo**](https://codesandbox.io/s/7wq15pm1n1) to get a live version of the component in action.


```jsx
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

// CSS styles are required in order to render piano correctly. Importing CSS requires
// a CSS loader. Alternatively, copy the CSS file directly from src/styles.css into your <head>.
import 'react-piano/dist/styles.css';

const firstNote = MidiNumbers.fromNote('c3');
const lastNote = MidiNumbers.fromNote('f5');

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

function App() {
  return (
    <Piano
      noteRange={{ first: firstNote, last: lastNote }}
      onPlayNote={(midiNumber) => {
        // Play a given note - see notes below
      }}
      onStopNote={(midiNumber) => {
        // Stop playing a given note - see notes below
      }}
      width={1000}
      keyboardShortcuts={keyboardShortcuts}
    />
  );
}
```

## Implementing audio playback

react-piano does not implement audio playback of each note, so you have to implement it with `onPlayNote` and `onStopNote` props. This gives you the ability to use any sounds you'd like with the rendered piano. The [react-piano demo page](http://www.kevinqi.com/react-piano/) uses @danigb's excellent [soundfont-player](https://github.com/danigb/soundfont-player) to play realistic-sounding soundfont samples. Take a look at the [**CodeSandbox demo**](https://codesandbox.io/s/7wq15pm1n1) to see how you can implement that yourself.

## Props

| Name | Type | Description |
| ---- | ---- | ----------- |
| `noteRange` | **Required** object | An object with format `{ first: 48, last: 77 }` where first and last are MIDI numbers that correspond to natural notes. You can use `MidiNumbers.NATURAL_MIDI_NUMBERS` to identify whether a number is a natural note or not. |
| `onPlayNote` | **Required** function | `(midiNumber) => void` function to play a note specified by MIDI number. |
| `onStopNote` | **Required** function | `(midiNumber) => void` function to stop playing a note. |
| `width` | **Conditionally required** number | Width in pixels of the component. While this is not strictly required, if you omit it, the container around the `<Piano>` will need to have an explicit width and height in order to render correctly. |
| `keyWidthToHeight` | Number | Ratio of key width to height. Used to specify the dimensions of the piano key. |
| `renderNoteLabel` | Function | `({ keyboardShortcut, midiNumber, isActive, isAccidental }) => node` function to render a label on piano keys that have keyboard shortcuts |
| `className` | String | A className to add to the component. |
| `disabled` | Boolean | Whether to show disabled state. Useful when audio sounds need to be asynchronously loaded. |
| `keyboardShortcuts` | Array of object | An array of form `[{ key: 'a', midiNumber: 48 }, ...]`, where `key` is a `keyEvent.key` value. You can generate this using `KeyboardShortcuts.create`, or use your own method to generate it. You can omit it if you don't want to use keyboard shortcuts. **Note:** this shouldn't be generated inline in JSX because it can cause problems when diffing for shortcut changes. |
| `playbackNotes` | Array of numbers | An array of form `[44, 47, 54]` which contains MIDI numbers to play back programmatically. |

## Customizing styles

You can customize many aspects of the piano using CSS. In javascript, you can override the base styles by creating your own set of overrides:

```javascript
import 'react-piano/dist/styles.css';
import './customPianoStyles.css';  // import a set of overrides
```

In the CSS file you can do things like:

```css
.ReactPiano__Key--active {
  background: #f00;  /* Change the default active key color to bright red */
}

.ReactPiano__Key--accidental {
  background: #000;  /* Change accidental keys to be completely black */
}
```

See [styles.css](/src/styles.css) for more detail on what styles can be customized.

## License

MIT
