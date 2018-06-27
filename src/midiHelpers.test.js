import { getMidiNumberAttributes } from './midiHelpers';

test('getMidiNumberAttributes', () => {
  const result = getMidiNumberAttributes(12);

  expect(result).toMatchObject({
    note: 'C0',
    basenote: 'C',
    octave: 0,
    isAccidental: false,
    midiNumber: 12,
  });
});
