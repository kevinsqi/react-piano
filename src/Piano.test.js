import React from 'react';
import { mount } from 'enzyme';

import Piano from './Piano';
import MidiNumbers from './MidiNumbers';

let eventListenerCallbacks;
let spyConsoleError;

describe('<Piano />', () => {
  beforeEach(() => {
    // For asserting that proptype validation happens through console.error.
    // mockImplementation prevents the actual console.error from appearing in test output.
    spyConsoleError = jest.spyOn(global.console, 'error').mockImplementation(() => {});

    // document.addEventListener is not triggered by .simulate()
    // https://github.com/airbnb/enzyme/issues/426
    eventListenerCallbacks = {};
    window.addEventListener = jest.fn((event, callback) => {
      eventListenerCallbacks[event] = callback;
    });
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
    test('renders correct number of keys', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
        />,
      );
      expect(spyConsoleError).not.toHaveBeenCalled();
      expect(wrapper.find('.ReactPiano__Key').length).toBe(13); // Should have 12 + 1 keys
    });
  });

  describe('onPlayNote and onStopNote', () => {
    test('is fired upon mousedown and mouseup', () => {
      const mockPlayNote = jest.fn();
      const mockStopNote = jest.fn();
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={mockPlayNote}
          onStopNote={mockStopNote}
        />,
      );

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('mousedown');

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(0);

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('mouseup');

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(1);
    });
    test('is fired upon touchstart and touchend', () => {
      const mockPlayNote = jest.fn();
      const mockStopNote = jest.fn();
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={mockPlayNote}
          onStopNote={mockStopNote}
        />,
      );

      // Need to first trigger window touchstart event callback so useTouchEvents is set
      eventListenerCallbacks['touchstart']();

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('touchstart');

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(0);

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('touchend');

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(1);
    });
  });
});
