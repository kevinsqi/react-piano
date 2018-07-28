import React from 'react';
import { mount } from 'enzyme';

import Piano from './Piano';
import MidiNumbers from './MidiNumbers';

let spyConsoleError;

describe('<Piano />', () => {
  beforeEach(() => {
    // For asserting that proptype validation happens through console.error.
    // mockImplementation prevents the actual console.error from appearing in test output.
    spyConsoleError = jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    spyConsoleError.mockRestore();
  });

  describe('noteRange', () => {
    test('requires natural midi numbers', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('db4'), last: MidiNumbers.fromNote('c5') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
        />,
      );
      expect(spyConsoleError).toHaveBeenCalledWith(
        expect.stringContaining(
          'noteRange values must be valid MIDI numbers, and should not be accidentals (sharp or flat notes)',
        ),
      );
    });
    test('requires note range to be in order', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c5'), last: MidiNumbers.fromNote('c3') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
        />,
      );
      expect(spyConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('noteRange.first must be smaller than noteRange.last'),
      );
    });
  });
});
