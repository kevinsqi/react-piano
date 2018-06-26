import { getMidiNumberAttributes } from 'react-piano';

function buildKeyboardShortcuts(startNote, keyboardConfig) {
  let currentMidiNumber = startNote;
  let naturalKeyIndex = 0;
  let keyboardShortcuts = [];
  while (naturalKeyIndex < keyboardConfig.length) {
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
