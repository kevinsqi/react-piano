import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';

import Key from './Key';
import MidiNumbers from './MidiNumbers';

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

function isNaturalMidiNumber(value) {
  if (typeof value !== 'number') {
    return false;
  }
  return MidiNumbers.NATURAL_MIDI_NUMBERS.includes(value);
}

function noteRangePropType(props, propName, componentName) {
  const { first, last } = props[propName];
  if (!first || !last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} must be an object with .first and .last values.`,
    );
  }
  if (!isNaturalMidiNumber(first) || !isNaturalMidiNumber(last)) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} values must be valid MIDI numbers, and should not be accidentals (sharp or flat notes).`,
    );
  }
  if (first >= last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName}.first must be smaller than ${propName}.last.`,
    );
  }
}

class Keyboard extends React.PureComponent {
  static propTypes = {
    noteRange: noteRangePropType,
    activeNotes: PropTypes.arrayOf(PropTypes.number),
    onPlayNote: PropTypes.func.isRequired,
    onStopNote: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    gliss: PropTypes.bool,
    useTouchEvents: PropTypes.bool,
    renderNoteLabel: PropTypes.func,
    // If width is not provided, must have fixed width and height in parent container
    width: PropTypes.number,
    layoutConfig: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    gliss: false,
    useTouchEvents: false,
    renderNoteLabel: () => {},
    layoutConfig: {
      keyWidthToHeightRatio: 0.22,
      whiteKeyGutterRatio: 0.02,
      whiteKey: {
        widthRatio: 1,
        heightRatio: 1,
        heightKeyDownRatio: 0.98,
      },
      blackKey: {
        widthRatio: 0.66,
        heightRatio: 0.66,
        heightKeyDownRatio: 0.65,
      },
      noteOffsetsFromC: {
        C: 0,
        Db: 0.55,
        D: 1,
        Eb: 1.8,
        E: 2,
        F: 3,
        Gb: 3.5,
        G: 4,
        Ab: 4.7,
        A: 5,
        Bb: 5.85,
        B: 6,
      },
    },
  };

  // Range of midi numbers on keyboard
  getMidiNumbers() {
    return range(this.props.noteRange.first, this.props.noteRange.last + 1);
  }

  getWhiteKeyCount() {
    return this.getMidiNumbers().filter((number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      return !isAccidental;
    }).length;
  }

  // Width of the white key as a ratio from 0 to 1, including the small space between keys
  getWhiteKeyWidthIncludingGutter() {
    return 1 / this.getWhiteKeyCount();
  }

  // Width of the white key as a ratio from 0 to 1
  getWhiteKeyWidth() {
    return (
      this.getWhiteKeyWidthIncludingGutter() * (1 - this.props.layoutConfig.whiteKeyGutterRatio)
    );
  }

  // Key position is represented by the number of white key widths from the left
  getKeyPosition(midiNumber) {
    const OCTAVE_WIDTH = 7;
    const { octave, basenote } = MidiNumbers.getAttributes(midiNumber);
    const offsetFromC = this.props.layoutConfig.noteOffsetsFromC[basenote];
    const { basenote: startBasenote, octave: startOctave } = MidiNumbers.getAttributes(
      this.props.noteRange.first,
    );
    const startOffsetFromC = this.props.layoutConfig.noteOffsetsFromC[startBasenote];
    const offsetFromFirstNote = offsetFromC - startOffsetFromC;
    const octaveOffset = OCTAVE_WIDTH * (octave - startOctave);
    return offsetFromFirstNote + octaveOffset;
  }

  getKeyConfig(midiNumber) {
    return MidiNumbers.getAttributes(midiNumber).isAccidental
      ? this.props.layoutConfig.blackKey
      : this.props.layoutConfig.whiteKey;
  }

  getWidth() {
    return this.props.width ? this.props.width : '100%';
  }

  getHeight() {
    return this.props.width
      ? `${(this.props.width * this.getWhiteKeyWidth()) /
          this.props.layoutConfig.keyWidthToHeightRatio}px`
      : '100%';
  }

  render() {
    return (
      <div
        className="ReactPiano__Keyboard"
        style={{ width: this.getWidth(), height: this.getHeight() }}
      >
        {this.getMidiNumbers().map((midiNumber) => {
          const { note, basenote, isAccidental } = MidiNumbers.getAttributes(midiNumber);
          const keyConfig = this.getKeyConfig(midiNumber);
          const isActive = this.props.activeNotes.includes(midiNumber);
          return (
            <Key
              left={ratioToPercentage(
                this.getKeyPosition(midiNumber) * this.getWhiteKeyWidthIncludingGutter(),
              )}
              width={ratioToPercentage(keyConfig.widthRatio * this.getWhiteKeyWidth())}
              height={ratioToPercentage(
                isActive ? keyConfig.heightKeyDownRatio : keyConfig.heightRatio,
              )}
              midiNumber={midiNumber}
              isActive={isActive}
              isAccidental={isAccidental}
              disabled={this.props.disabled}
              renderNoteLabel={this.props.renderNoteLabel}
              onPlayNote={this.props.onPlayNote}
              onStopNote={this.props.onStopNote}
              gliss={this.props.gliss}
              useTouchEvents={this.props.useTouchEvents}
              key={midiNumber}
            />
          );
        })}
      </div>
    );
  }
}

export default Keyboard;
