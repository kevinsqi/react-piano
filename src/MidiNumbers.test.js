import MidiNumbers from './MidiNumbers';

test('getAttributes', () => {
  expect(MidiNumbers.getAttributes(12)).toMatchObject({
    note: 'C0',
    pitchName: 'C',
    octave: 0,
    isAccidental: false,
    midiNumber: 12,
  });
  expect(MidiNumbers.getAttributes(51)).toMatchObject({
    note: 'Eb3',
    pitchName: 'Eb',
    octave: 3,
    isAccidental: true,
    midiNumber: 51,
  });
  expect(() => MidiNumbers.getAttributes(5)).toThrow();
});

test('fromNote', () => {
  expect(MidiNumbers.fromNote('C#0')).toBe(13);
  expect(MidiNumbers.fromNote('c#0')).toBe(13);
  expect(MidiNumbers.fromNote('eb5')).toBe(75);
  expect(MidiNumbers.fromNote('G4')).toBe(67);

  // Invalid notes
  expect(() => MidiNumbers.fromNote('fb1')).toThrow();
  expect(() => MidiNumbers.fromNote('')).toThrow();
  expect(() => MidiNumbers.fromNote(null)).toThrow();
});

test('NATURAL_MIDI_NUMBERS', () => {
  expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(11); // out of range
  expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(128); // out of range
  expect(MidiNumbers.NATURAL_MIDI_NUMBERS).toContain(74); // D5
  expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(75); // Eb5
});
