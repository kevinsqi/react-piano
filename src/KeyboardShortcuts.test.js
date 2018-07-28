import KeyboardShortcuts from './KeyboardShortcuts';

describe('create', () => {
  test('correct configuration', () => {
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: 40,
      lastNote: 50,
      keyboardConfig: [
        {
          natural: 's',
          flat: 'w',
        },
        {
          natural: 'd',
          flat: 'e',
        },
      ],
    });

    expect(keyboardShortcuts).toEqual([{ key: 's', midiNumber: 40 }, { key: 'd', midiNumber: 41 }]);
  });
  test('does not create shortcuts exceeding lastNote', () => {
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: 40,
      lastNote: 41,
      keyboardConfig: [
        {
          natural: 's',
          flat: 'w',
        },
        {
          natural: 'd',
          flat: 'e',
        },
        {
          natural: 'f',
          flat: 'r',
        },
      ],
    });

    expect(keyboardShortcuts).toEqual([{ key: 's', midiNumber: 40 }, { key: 'd', midiNumber: 41 }]);
  });
});
