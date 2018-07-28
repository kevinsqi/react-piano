import MidiNumbers from './MidiNumbers';

describe('getAttributes', () => {
  test('valid notes', () => {
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
  });
  test('invalid notes', () => {
    expect(() => MidiNumbers.getAttributes(5)).toThrow();
  });
});

describe('fromNote', () => {
  test('valid notes', () => {
    expect(MidiNumbers.fromNote('C#0')).toBe(13);
    expect(MidiNumbers.fromNote('c#0')).toBe(13);
    expect(MidiNumbers.fromNote('c3')).toBe(48);
    expect(MidiNumbers.fromNote('eb5')).toBe(75);
    expect(MidiNumbers.fromNote('G4')).toBe(67);
  });
  test('invalid notes', () => {
    expect(() => MidiNumbers.fromNote('fb1')).toThrow();
    expect(() => MidiNumbers.fromNote('')).toThrow();
    expect(() => MidiNumbers.fromNote(null)).toThrow();
  });
});

describe('NATURAL_MIDI_NUMBERS', () => {
  test('does not contain out-of-range numbers', () => {
    expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(11); // out of range
    expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(128); // out of range
  });
  test('contains only natural note numbers', () => {
    expect(MidiNumbers.NATURAL_MIDI_NUMBERS).toContain(74); // D5
    expect(MidiNumbers.NATURAL_MIDI_NUMBERS).not.toContain(75); // Eb5
  });
});
