// noreintegrate handle null flats/sharps
// noreintegrate setup NPM and github pages demo
// noreintegrate fix dragging
// noreintegrate animate height, refactor active color logic
// noreintegrate have auto-width vs manual width settings
import React from 'react';
import _ from 'lodash';

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

// TODO: rewrite clearly
function midiNumberToFrequency(number) {
  const A4 = 440;
  return A4 / 32 * Math.pow(2, (number - 9) / 12);
}

// TODO: move to separate file
const NOTE_ARRAY = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
const MIDI_NUMBER_C0 = 12;
const NOTE_REGEX = /(\w+)(\d)/;
const NOTES_IN_OCTAVE = 12;
function noteToMidiNumber(note) {
  const [, basenote, octave] = NOTE_REGEX.exec(note);
  const offset = NOTE_ARRAY.indexOf(basenote);
  return MIDI_NUMBER_C0 + offset + NOTES_IN_OCTAVE * parseInt(octave, 10);
}
function getMidiNumberAttributes(number) {
  const offset = (number - MIDI_NUMBER_C0) % NOTES_IN_OCTAVE;
  const octave = Math.floor((number - MIDI_NUMBER_C0) / NOTES_IN_OCTAVE);
  const basenote = NOTE_ARRAY[offset];
  return {
    note: `${basenote}${octave}`,
    basenote,
    octave,
    midiNumber: number,
    frequency: midiNumberToFrequency(number),
  };
}

// noreintegrate refactor
function getKeyboardShortcutsForMidiNumbers(numbers, noteConfig, keyboardConfig) {
  let keyIndex = 0;
  const keysToMidiNumbers = {};
  for (let numIndex = 0; numIndex < numbers.length; numIndex += 1) {
    const num = numbers[numIndex];
    const { basenote } = getMidiNumberAttributes(num);
    const { isBlackKey } = noteConfig[basenote];

    const key = keyboardConfig[keyIndex];
    // noreintegrate should check isFlat
    if (isBlackKey) {
      keysToMidiNumbers[key.flat] = num;
    } else {
      keysToMidiNumbers[key.natural] = num;
      keyIndex += 1;

      if (keyIndex >= keyboardConfig.length) {
        break;
      }
    }
  }
  return keysToMidiNumbers;
}

function Key(props) {
  return (
    <div
      style={Object.assign(
        {
          position: 'absolute',
          top: 0,
          left: props.left,
          width: props.width,
          height: props.height,
        },
        props.style,
      )}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onTouchStart={props.onTouchStart}
      onTouchCancel={props.onTouchCancel}
      onTouchEnd={props.onTouchEnd}
    >
      <span style={{ color: '#999', textTransform: 'capitalize' }}>{props.note}</span>
    </div>
  );
}

class Piano extends React.Component {
  state = {
    keysDown: {},
  };

  static defaultProps = {
    whiteKeyGutter: 0.02,
    whiteKeyConfig: {
      widthRatio: 1,
      heightRatio: 1,
      heightKeyDownRatio: 0.98,
      style: {
        zIndex: 0,
        borderRadius: '0 0 6px 6px',
        border: '1px solid #888',
        boxShadow: '0 0 5px #ccc',
        background: '#f6f5f3',
      },
    },
    blackKeyConfig: {
      widthRatio: 0.66,
      heightRatio: 0.66,
      heightKeyDownRatio: 0.65,
      style: {
        zIndex: 1,
        borderRadius: '0 0 4px 4px',
        border: '1px solid #fff',
        background: '#555',
      },
    },
    noteConfig: {
      c: { offsetFromC: 0, isBlackKey: false },
      db: { offsetFromC: 0.55, isBlackKey: true },
      d: { offsetFromC: 1, isBlackKey: false },
      eb: { offsetFromC: 1.8, isBlackKey: true },
      e: { offsetFromC: 2, isBlackKey: false },
      f: { offsetFromC: 3, isBlackKey: false },
      gb: { offsetFromC: 3.5, isBlackKey: true },
      g: { offsetFromC: 4, isBlackKey: false },
      ab: { offsetFromC: 4.7, isBlackKey: true },
      a: { offsetFromC: 5, isBlackKey: false },
      bb: { offsetFromC: 5.85, isBlackKey: true },
      b: { offsetFromC: 6, isBlackKey: false },
    },
    onKeyDown: (keyAttrs) => {},
    onKeyUp: (keyAttrs) => {},
  };

  componentDidMount() {
    if (this.props.keyboardConfig) {
      // noreintegrate only enable if a prop is passed
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    // noreintegrate remove event listeners
  }

  getMidiNumbers() {
    const startNum = noteToMidiNumber(this.props.startNote);
    return _.range(startNum, noteToMidiNumber(this.props.endNote) + 1);
  }

  getMidiNumberForKey = (key) => {
    const mapping = getKeyboardShortcutsForMidiNumbers(
      this.getMidiNumbers(),
      this.props.noteConfig,
      this.props.keyboardConfig,
    );
    return mapping[key];
  };

  handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onKeyDown(midiNumber);
    }
  };
  handleKeyUp = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onKeyUp(midiNumber);
    }
  };

  // noreintegrate rename onNoteDown/onNoteUp
  onKeyDown = (midiNumber) => {
    this.setState({
      keysDown: Object.assign({}, this.state.keysDown, {
        [midiNumber]: true,
      }),
    });
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onKeyDown(attrs);
  };

  onKeyUp = (midiNumber) => {
    this.setState({
      keysDown: Object.assign({}, this.state.keysDown, {
        [midiNumber]: false,
      }),
    });
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onKeyUp(attrs);
  };

  render() {
    const startNum = noteToMidiNumber(this.props.startNote);
    const midiNumbers = this.getMidiNumbers();
    const numWhiteKeys = midiNumbers.filter((num) => {
      const { basenote } = getMidiNumberAttributes(num);
      return !this.props.noteConfig[basenote].isBlackKey;
    }).length;
    const distanceBetweenWhiteKeys = 1 / numWhiteKeys;
    const whiteKeyWidth = distanceBetweenWhiteKeys * (1 - this.props.whiteKeyGutter);
    const octaveWidth = 7;

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {midiNumbers.map((num) => {
          // TODO: refactor, BlackKey/WhiteKey?
          const { octave, basenote, note } = getMidiNumberAttributes(num);
          const noteConfig = this.props.noteConfig[basenote];
          const keyConfig = noteConfig.isBlackKey
            ? this.props.blackKeyConfig
            : this.props.whiteKeyConfig;
          const startNoteAttrs = getMidiNumberAttributes(startNum);
          const leftPosition =
            noteConfig.offsetFromC -
            this.props.noteConfig[startNoteAttrs.basenote].offsetFromC +
            octaveWidth * (octave - startNoteAttrs.octave);
          const isKeyDown = this.state.keysDown[num];
          return (
            <Key
              note={note}
              left={ratioToPercentage(leftPosition * distanceBetweenWhiteKeys)}
              width={ratioToPercentage(keyConfig.widthRatio * whiteKeyWidth)}
              height={ratioToPercentage(
                isKeyDown ? keyConfig.heightKeyDownRatio : keyConfig.heightRatio,
              )}
              style={Object.assign({}, keyConfig.style, {
                background: isKeyDown ? '#01baef' : keyConfig.style.background,
              })}
              onMouseDown={this.onKeyDown.bind(this, num)}
              onMouseUp={this.onKeyUp.bind(this, num)}
              onTouchStart={this.onKeyDown.bind(this, num)}
              onTouchCancel={this.onKeyUp.bind(this, num)}
              onTouchEnd={this.onKeyUp.bind(this, num)}
              key={num}
            />
          );
        })}
      </div>
    );
  }
}

export default Piano;
