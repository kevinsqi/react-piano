import MidiNumbers from './MidiNumbers';

test('getAttributes', () => {
  const result = MidiNumbers.getAttributes(12);

  expect(result).toMatchObject({
    note: 'C0',
    basenote: 'C',
    octave: 0,
    isAccidental: false,
    midiNumber: 12,
  });
});
