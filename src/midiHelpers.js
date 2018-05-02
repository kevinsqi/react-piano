const NOTE_ARRAY = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
const MIDI_NUMBER_C0 = 12;
const NOTE_REGEX = /(\w+)(\d)/;
const NOTES_IN_OCTAVE = 12;

// TODO: rewrite more understandably
function midiNumberToFrequency(number) {
  const A4 = 440;
  return A4 / 32 * Math.pow(2, (number - 9) / 12);
}

export function noteToMidiNumber(note) {
  const [, basenote, octave] = NOTE_REGEX.exec(note);
  const offset = NOTE_ARRAY.indexOf(basenote);
  return MIDI_NUMBER_C0 + offset + NOTES_IN_OCTAVE * parseInt(octave, 10);
}

export function getMidiNumberAttributes(number) {
  const offset = (number - MIDI_NUMBER_C0) % NOTES_IN_OCTAVE;
  const octave = Math.floor((number - MIDI_NUMBER_C0) / NOTES_IN_OCTAVE);
  const basenote = NOTE_ARRAY[offset];
  return {
    note: `${basenote}${octave}`,
    basenote,
    octave,
    midiNumber: number,
    frequency: midiNumberToFrequency(number),
  };
}
