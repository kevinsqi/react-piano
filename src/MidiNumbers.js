import range from 'lodash.range';

const BASENOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const BASENOTE_NUMBERS = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
};
const ACCIDENTALS = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
const MIDI_NUMBER_C0 = 12;
const MIN_MIDI_NUMBER = MIDI_NUMBER_C0;
const MAX_MIDI_NUMBER = 127;
const NOTE_REGEX = /([a-g])([#b]?)(\d+)/;
const NOTES_IN_OCTAVE = 12;

function buildMidiNumberAttributes(midiNumber) {
  const offsetFromC = (midiNumber - MIDI_NUMBER_C0) % NOTES_IN_OCTAVE;
  const octave = Math.floor((midiNumber - MIDI_NUMBER_C0) / NOTES_IN_OCTAVE);
  const basenote = BASENOTES[offsetFromC];
  return {
    note: `${basenote}${octave}`,
    basenote,
    octave,
    midiNumber,
    isAccidental: ACCIDENTALS.includes(basenote),
  };
}

function buildMidiNumberAttributesCache() {
  return range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).reduce((cache, midiNumber) => {
    cache[midiNumber] = buildMidiNumberAttributes(midiNumber);
    return cache;
  }, {});
}

const midiNumberAttributesCache = buildMidiNumberAttributesCache();

// Converts string notes in scientific pitch notation to a MIDI number, or null if not a note.
//
// Example: "c#0" => 13, "eb5" => 75, "abc" => null
//
// References:
// - http://www.flutopedia.com/octave_notation.htm
// - https://github.com/danigb/tonal/blob/master/packages/note/index.js
function fromNote(note) {
  if (!note) {
    return null;
  }
  const match = NOTE_REGEX.exec(note.toLowerCase());
  if (!match) {
    return null;
  }
  const [, letter, accidental, octave] = match;
  const basenote = `${letter.toUpperCase()}${accidental}`;
  const offsetFromC = BASENOTE_NUMBERS[basenote];
  if (!offsetFromC) {
    return null;
  }
  return MIDI_NUMBER_C0 + offsetFromC + NOTES_IN_OCTAVE * parseInt(octave, 10);
}

function getAttributes(midiNumber) {
  const attrs = midiNumberAttributesCache[midiNumber];
  if (!attrs) {
    throw Error('MIDI number out of range');
  }
  return attrs;
}

const NATURAL_MIDI_NUMBERS = range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).filter(
  (midiNumber) => !getAttributes(midiNumber).isAccidental,
);

export default {
  fromNote,
  getAttributes,
  MIN_MIDI_NUMBER,
  MAX_MIDI_NUMBER,
  NATURAL_MIDI_NUMBERS,
};
