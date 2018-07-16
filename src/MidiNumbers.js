import range from 'lodash.range';

const BASENOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const ACCIDENTALS = ['Db', 'Eb', 'Gb', 'Ab', 'Bb'];
const MIDI_NUMBER_C0 = 12;
const MIN_MIDI_NUMBER = MIDI_NUMBER_C0;
const MAX_MIDI_NUMBER = 127;
const NOTE_REGEX = /(\w+)(\d)/;
const NOTES_IN_OCTAVE = 12;

function buildMidiNumberAttributes(number) {
  const offset = (number - MIDI_NUMBER_C0) % NOTES_IN_OCTAVE;
  const octave = Math.floor((number - MIDI_NUMBER_C0) / NOTES_IN_OCTAVE);
  const basenote = BASENOTES[offset];
  return {
    note: `${basenote}${octave}`,
    basenote,
    octave,
    midiNumber: number,
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

// Notes are strings in the format "[basenote][octave]", e.g. "a4", "cb7"
// Converts note to midi number, as specified in:
// https://www.midikits.net/midi_analyser/midi_note_numbers_for_octaves.htm
function noteToMidiNumber(note) {
  const [, basenote, octave] = NOTE_REGEX.exec(note);
  const offset = BASENOTES.indexOf(basenote);
  return MIDI_NUMBER_C0 + offset + NOTES_IN_OCTAVE * parseInt(octave, 10);
}

function getAttributes(number) {
  const attrs = midiNumberAttributesCache[number];
  if (!attrs) {
    throw Error('MIDI number out of range');
  }
  return attrs;
}

const NATURAL_MIDI_NUMBERS = range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).filter(
  (midiNumber) => !getAttributes(midiNumber).isAccidental,
);

export default {
  getAttributes,
  MIN_MIDI_NUMBER,
  MAX_MIDI_NUMBER,
  NATURAL_MIDI_NUMBERS,
};
