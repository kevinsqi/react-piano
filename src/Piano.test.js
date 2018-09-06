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
    test('renders correct keys', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
        />,
      );
      expect(spyConsoleError).not.toHaveBeenCalled();
      expect(wrapper.find('.ReactPiano__Key').length).toBe(13); // Should have 12 + 1 keys
      expect(wrapper.find('.ReactPiano__Key--natural').length).toBe(8); // Should have 7 + 1 natural keys
      expect(wrapper.find('.ReactPiano__Key--accidental').length).toBe(5);
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

  describe('keyboardShortcuts', () => {
    test('key events trigger onPlayNote and onStopNote', () => {
      const firstNote = MidiNumbers.fromNote('c3');
      const lastNote = MidiNumbers.fromNote('c4');
      const mockPlayNote = jest.fn();
      const mockStopNote = jest.fn();
      const keyboardShortcuts = [{ key: 'a', midiNumber: MidiNumbers.fromNote('c3') }];

      const wrapper = mount(
        <Piano
          noteRange={{ first: firstNote, last: lastNote }}
          onPlayNote={mockPlayNote}
          onStopNote={mockStopNote}
          keyboardShortcuts={keyboardShortcuts}
        />,
      );

      // Trigger window keydown with a mock event
      eventListenerCallbacks['keydown']({
        key: 'a',
      });

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(0);

      eventListenerCallbacks['keyup']({
        key: 'a',
      });

      expect(mockPlayNote).toHaveBeenCalledTimes(1);
      expect(mockStopNote).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    test('disables firing of onPlayNote and onStopNote', () => {
      const mockPlayNote = jest.fn();
      const mockStopNote = jest.fn();
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={mockPlayNote}
          onStopNote={mockStopNote}
          disabled
        />,
      );

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('mousedown');

      expect(mockPlayNote).toHaveBeenCalledTimes(0);

      wrapper
        .find('.ReactPiano__Key')
        .first()
        .simulate('mouseup');

      expect(mockStopNote).toHaveBeenCalledTimes(0);
    });

    test('renders disabled key state', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
          disabled
        />,
      );

      expect(wrapper.find('.ReactPiano__Key--disabled').length).toBe(13);
    });
  });

  describe('className', () => {
    test('adds a className', () => {
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
          className="Hello"
        />,
      );

      expect(wrapper.find('.ReactPiano__Keyboard').hasClass('Hello')).toBe(true);
    });
  });

  describe('renderNoteLabel', () => {
    test('default value has correct behavior', () => {
      const keyboardShortcuts = [{ key: 'a', midiNumber: MidiNumbers.fromNote('c3') }];
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
          keyboardShortcuts={keyboardShortcuts}
        />,
      );

      // First key should have label with correct classes
      const firstKey = wrapper.find('.ReactPiano__Key').at(0);
      expect(firstKey.find('.ReactPiano__NoteLabel').text()).toBe('a');
      expect(
        firstKey.find('.ReactPiano__NoteLabel').hasClass('ReactPiano__NoteLabel--natural'),
      ).toBe(true);

      // Second key should not have label
      const secondKey = wrapper.find('.ReactPiano__Key').at(1);
      expect(secondKey.find('.ReactPiano__NoteLabel').exists()).toBe(false);
    });
    test('works for keys with and without shortcuts', () => {
      const keyboardShortcuts = [{ key: 'a', midiNumber: MidiNumbers.fromNote('c3') }];
      const wrapper = mount(
        <Piano
          noteRange={{ first: MidiNumbers.fromNote('c3'), last: MidiNumbers.fromNote('c4') }}
          onPlayNote={() => {}}
          onStopNote={() => {}}
          keyboardShortcuts={keyboardShortcuts}
          renderNoteLabel={({ keyboardShortcut, midiNumber, isActive, isAccidental }) => {
            return (
              <div>
                <div className="label-keyboardShortcut">{keyboardShortcut}</div>
                <div className="label-midiNumber">{midiNumber}</div>
              </div>
            );
          }}
        />,
      );

      // First key should have midinumber and keyboard shortcut labels
      const firstKey = wrapper.find('.ReactPiano__Key').at(0);
      expect(firstKey.find('.label-midiNumber').text()).toBe(`${MidiNumbers.fromNote('c3')}`);
      expect(firstKey.find('.label-keyboardShortcut').text()).toBe('a');

      // Second key should only have midinumber label
      const secondKey = wrapper.find('.ReactPiano__Key').at(1);
      expect(secondKey.find('.label-midiNumber').text()).toBe(`${MidiNumbers.fromNote('db3')}`);
      expect(secondKey.find('.label-keyboardShortcut').text()).toBe('');
    });
  });
});
