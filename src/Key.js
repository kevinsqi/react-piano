import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MidiNumbers from './MidiNumbers';

class Key extends React.PureComponent {
  static propTypes = {
    midiNumber: PropTypes.number.isRequired,
    naturalKeyWidth: PropTypes.number.isRequired, // Width as a ratio between 0 and 1
    accidentalWidthRatio: PropTypes.number.isRequired,
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    accidental: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onPlayNote: PropTypes.func.isRequired,
    onStopNote: PropTypes.func.isRequired,
    layoutConfig: PropTypes.object.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    accidentalWidthRatio: 0.66,
    layoutConfig: {
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

  playNote = () => {
    this.props.onPlayNote(this.props.midiNumber);
  };

  stopNote = () => {
    this.props.onStopNote(this.props.midiNumber);
  };

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

  render() {
    const {
      naturalKeyWidth,
      accidentalWidthRatio,
      midiNumber,
      gliss,
      useTouchEvents,
      accidental,
      active,
      disabled,
      children,
    } = this.props;

    // Need to conditionally include/exclude handlers based on useTouchEvents,
    // because otherwise mobile taps double fire events.
    return (
      <div
        className={classNames('ReactPiano__Key', {
          'ReactPiano__Key--black': accidental,
          'ReactPiano__Key--white': !accidental,
          'ReactPiano__Key--disabled': disabled,
          'ReactPiano__Key--active': active,
        })}
        style={{
          left: ratioToPercentage(this.getKeyPosition(midiNumber) * naturalKeyWidth),
          width: ratioToPercentage(
            accidental ? accidentalWidthRatio * naturalKeyWidth : naturalKeyWidth,
          ),
        }}
        onMouseDown={useTouchEvents ? null : this.playNote}
        onMouseUp={useTouchEvents ? null : this.stopNote}
        onMouseEnter={gliss ? this.playNote : null}
        onMouseLeave={this.stopNote}
        onTouchStart={useTouchEvents ? this.playNote : null}
        onTouchCancel={useTouchEvents ? this.stopNote : null}
        onTouchEnd={useTouchEvents ? this.stopNote : null}
      >
        <div className="ReactPiano__NoteLabelContainer">{children}</div>
      </div>
    );
  }
}

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

export default Key;
