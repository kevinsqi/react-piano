import MidiNumbers from './MidiNumbers';

test('getAttributes', () => {
  const result = MidiNumbers.getAttributes(12);

  expect(result).toMatchObject({
    note: 'C0',
    pitchName: 'C',
    octave: 0,
    isAccidental: false,
    midiNumber: 12,
  });
});

test('fromNote', () => {
  expect(MidiNumbers.fromNote('c#0')).toBe(13);
  expect(MidiNumbers.fromNote('eb5')).toBe(75);
  expect(MidiNumbers.fromNote('G4')).toBe(67);

  // Invalid notes
  expect(MidiNumbers.fromNote('fb1')).toBe(null);
  expect(MidiNumbers.fromNote('')).toBe(null);
  expect(MidiNumbers.fromNote(null)).toBe(null);
});
