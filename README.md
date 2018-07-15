# react-piano

[![npm version](https://img.shields.io/npm/v/react-piano.svg)](https://www.npmjs.com/package/react-piano)
[![build status](https://travis-ci.com/iqnivek/react-piano.svg?branch=master)](https://travis-ci.com/iqnivek/react-piano)

An interactive piano keyboard for React. Supports custom sounds, touch/click/keyboard events, and fully configurable styling.

 super-customizable piano keyboard for React.

<a href="http://www.kevinqi.com/react-piano/"><img width="500" src="/demo/public/images/react-piano-screenshot.png" alt="react-piano screenshot" /></a>

## Installing

⚠️ **Warning:** This component is a work in progress and not well-suited for production use yet! The API will be changing significantly. Feel free to play around with it, but a v1.0.0 release is recommended for production use.

```
yarn add react-piano
```

## Usage

```jsx
import { Piano, buildKeyboardShortcuts, KEYBOARD_SHORTCUT_CONFIGS } from 'react-piano';

// CSS styles are required in order to render piano correctly.
// Importing CSS requires a CSS loader. You can also copy the CSS file directly from src/styles.css.
import 'react-piano/build/styles.css';

// Implement audio playback
function playNote(midiNumber) { ... }
function stopNote(midiNumber) { ... }

const firstNote = 48;
const lastNote = 77;

<Piano
  firstNote={firstNote}
  lastNote={lastNote}
  onPlayNote={playNote}
  onStopNote={stopNote}
  width={1000}
  keyboardShortcuts={buildKeyboardShortcuts(firstNote, KEYBOARD_SHORTCUT_CONFIGS.homeRow)}
/>
```

## Implementing audio playback

react-piano does not implement audio playback of each note, so you have to implement it with `onPlayNote` and `onStopNote` props. This allows you to customize any sounds you'd like to the piano.

## License

MIT
