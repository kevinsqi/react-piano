import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import Key from './Key';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

class Piano extends React.Component {
  static defaultProps = {
    config: {
      keyWidthToHeightRatio: 0.15, // TODO: use props.height instead?
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
        c: 0,
        db: 0.55,
        d: 1,
        eb: 1.8,
        e: 2,
        f: 3,
        gb: 3.5,
        g: 4,
        ab: 4.7,
        a: 5,
        bb: 5.85,
        b: 6,
      },
    },
    renderNoteLabel: () => {},
  };

  // Range of midi numbers from startNote to endNote
  getMidiNumbers() {
    const startNum = noteToMidiNumber(this.props.startNote);
    return _.range(startNum, noteToMidiNumber(this.props.endNote) + 1);
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
    return this.getWhiteKeyWidthIncludingGutter() * (1 - this.props.config.whiteKeyGutterRatio);
  }

  // Key position is represented by the number of white key widths from the left
  getKeyPosition(midiNumber) {
    const OCTAVE_WIDTH = 7;
    const { octave, basenote } = getMidiNumberAttributes(midiNumber);
    const offsetFromC = this.props.config.noteOffsetsFromC[basenote];
    const startNum = noteToMidiNumber(this.props.startNote);
    const { basenote: startBasenote, octave: startOctave } = getMidiNumberAttributes(startNum);
    const startOffsetFromC = this.props.config.noteOffsetsFromC[startBasenote];
    const offsetFromStartNote = offsetFromC - startOffsetFromC;
    const octaveOffset = OCTAVE_WIDTH * (octave - startOctave);
    return offsetFromStartNote + octaveOffset;
  }

  getKeyConfig(midiNumber) {
    return getMidiNumberAttributes(midiNumber).isAccidental
      ? this.props.config.blackKey
      : this.props.config.whiteKey;
  }

  getWidth() {
    return this.props.width ? this.props.width : '100%';
  }

  getHeight() {
    return this.props.width
      ? `${this.props.width * this.getWhiteKeyWidth() / this.props.config.keyWidthToHeightRatio}px`
      : '100%';
  }

  handleNoteDown = (midiNumber) => {
    // Prevents duplicate note firings
    if (this.props.keysDown[midiNumber] || this.props.disabled) {
      return;
    }
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onNoteDown(attrs);
  };

  handleNoteUp = (midiNumber) => {
    if (!this.props.keysDown[midiNumber] || this.props.disabled) {
      return;
    }
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onNoteUp(attrs);
  };

  render() {
    console.log('props', this.props);
    return (
      <div style={{ position: 'relative', width: this.getWidth(), height: this.getHeight() }}>
        {this.getMidiNumbers().map((num) => {
          const { note, basenote, isAccidental } = getMidiNumberAttributes(num);
          const keyConfig = this.getKeyConfig(num);
          const isKeyDown = this.props.keysDown[num];
          return (
            <Key
              className={classNames('ReactPiano__Key', {
                'ReactPiano__Key--black': isAccidental,
                'ReactPiano__Key--white': !isAccidental,
                'ReactPiano__Key--disabled': this.props.disabled,
                'ReactPiano__Key--down': isKeyDown,
              })}
              left={ratioToPercentage(
                this.getKeyPosition(num) * this.getWhiteKeyWidthIncludingGutter(),
              )}
              width={ratioToPercentage(keyConfig.widthRatio * this.getWhiteKeyWidth())}
              height={ratioToPercentage(
                isKeyDown ? keyConfig.heightKeyDownRatio : keyConfig.heightRatio,
              )}
              onNoteDown={this.handleNoteDown.bind(this, num)}
              onNoteUp={this.handleNoteUp.bind(this, num)}
              gliss={this.props.gliss}
              key={num}
            >
              {this.props.disabled
                ? null
                : this.props.renderNoteLabel({
                    note,
                    basenote,
                    isBlack: isAccidental,
                  })}
            </Key>
          );
        })}
      </div>
    );
  }
}

export default Piano;
