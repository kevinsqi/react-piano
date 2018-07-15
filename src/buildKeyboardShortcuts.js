import { getMidiNumberAttributes, MAX_MIDI_NUMBER } from './midiHelpers';

function buildKeyboardShortcuts(firstNote, keyboardConfig) {
  let currentMidiNumber = firstNote;
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
