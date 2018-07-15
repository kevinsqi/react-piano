import React from 'react';
import PropTypes from 'prop-types';
import range from 'lodash.range';
import classNames from 'classnames';

import Key from './Key';
import { getMidiNumberAttributes, NATURAL_MIDI_NUMBERS } from './midiHelpers';

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

function midiNumberPropType(props, propName, componentName) {
  const value = props[propName];
  if (typeof value !== 'number') {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} must be a number.`,
    );
  }
  if (!NATURAL_MIDI_NUMBERS.includes(props[propName])) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} must be a valid MIDI number which is not an accidental.`,
    );
  }
}

class Keyboard extends React.Component {
  static propTypes = {
    startNote: midiNumberPropType,
    endNote: midiNumberPropType,
    activeNotes: PropTypes.arrayOf(PropTypes.number),
    onNoteStart: PropTypes.func.isRequired,
    onNoteStop: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    gliss: PropTypes.bool,
    touchEvents: PropTypes.bool,
    renderNoteLabel: PropTypes.func,
    // If width is not provided, must have fixed width and height in parent container
    width: PropTypes.number,
    layoutConfig: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    gliss: false,
    touchEvents: false,
    renderNoteLabel: () => {},
    layoutConfig: {
      keyWidthToHeightRatio: 0.2, // TODO: use props.height instead?
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

  // Range of midi numbers from startNote to endNote
  getMidiNumbers() {
    return range(this.props.startNote, this.props.endNote + 1);
  }

  getWhiteKeyCount() {
    return this.getMidiNumbers().filter((number) => {
      const { isAccidental } = getMidiNumberAttributes(number);
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
    const { octave, basenote } = getMidiNumberAttributes(midiNumber);
    const offsetFromC = this.props.layoutConfig.noteOffsetsFromC[basenote];
    const { basenote: startBasenote, octave: startOctave } = getMidiNumberAttributes(
      this.props.startNote,
    );
    const startOffsetFromC = this.props.layoutConfig.noteOffsetsFromC[startBasenote];
    const offsetFromStartNote = offsetFromC - startOffsetFromC;
    const octaveOffset = OCTAVE_WIDTH * (octave - startOctave);
    return offsetFromStartNote + octaveOffset;
  }

  getKeyConfig(midiNumber) {
    return getMidiNumberAttributes(midiNumber).isAccidental
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
          const { note, basenote, isAccidental } = getMidiNumberAttributes(midiNumber);
          const keyConfig = this.getKeyConfig(midiNumber);
          const isActive = this.props.activeNotes.includes(midiNumber);
          return (
            <Key
              className={classNames('ReactPiano__Key', {
                'ReactPiano__Key--black': isAccidental,
                'ReactPiano__Key--white': !isAccidental,
                'ReactPiano__Key--disabled': this.props.disabled,
                'ReactPiano__Key--active': isActive,
              })}
              left={ratioToPercentage(
                this.getKeyPosition(midiNumber) * this.getWhiteKeyWidthIncludingGutter(),
              )}
              width={ratioToPercentage(keyConfig.widthRatio * this.getWhiteKeyWidth())}
              height={ratioToPercentage(
                isActive ? keyConfig.heightKeyDownRatio : keyConfig.heightRatio,
              )}
              onNoteStart={this.props.onNoteStart.bind(this, midiNumber)}
              onNoteStop={this.props.onNoteStop.bind(this, midiNumber)}
              gliss={this.props.gliss}
              touchEvents={this.props.touchEvents}
              key={midiNumber}
            >
              {this.props.disabled
                ? null
                : this.props.renderNoteLabel({ midiNumber: midiNumber, isActive, isAccidental })}
            </Key>
          );
        })}
      </div>
    );
  }
}

export default Keyboard;
