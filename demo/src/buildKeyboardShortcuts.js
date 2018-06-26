import { getMidiNumberAttributes } from 'react-piano';

const MAX_MIDI_NUMBER = 127;

function buildKeyboardShortcuts(startNote, keyboardConfig) {
  let currentMidiNumber = startNote;
  let naturalKeyIndex = 0;
  let keyboardShortcuts = [];
  while (naturalKeyIndex < keyboardConfig.length && currentMidiNumber <= MAX_MIDI_NUMBER) {
    const key = keyboardConfig[naturalKeyIndex];
    const { isAccidental } = getMidiNumberAttributes(currentMidiNumber);
    if (isAccidental) {
      keyboardShortcuts.push({
        key: key.flat,
        midiNumber: currentMidiNumber,
      });
    } else {
      keyboardShortcuts.push({
        key: key.natural,
        midiNumber: currentMidiNumber,
      });
      naturalKeyIndex += 1;
    }
    currentMidiNumber += 1;
  }
  return keyboardShortcuts;
}

export default buildKeyboardShortcuts;
