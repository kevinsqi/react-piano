import { getMidiNumberAttributes } from 'react-piano';

export function buildKeyboardShortcuts(midiNumbers, keyboardConfig) {
  let naturalKeyIndex = 0;
  let keyboardShortcuts = [];
  for (let index = 0; index < midiNumbers.length; index += 1) {
    const midiNumber = midiNumbers[index];
    const key = keyboardConfig[naturalKeyIndex];
    const { isAccidental } = getMidiNumberAttributes(midiNumber);
    if (isAccidental) {
      keyboardShortcuts.push({
        key: key.flat,
        midiNumber: midiNumber,
      });
    } else {
      keyboardShortcuts.push({
        key: key.natural,
        midiNumber: midiNumber,
      });
      naturalKeyIndex += 1;

      if (naturalKeyIndex >= keyboardConfig.length) {
        break;
      }
    }
  }
  return keyboardShortcuts;
}
