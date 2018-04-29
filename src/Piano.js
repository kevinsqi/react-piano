// noreintegrate can override sounds
// noreintegrate active notes
// noreintegrate have auto-width vs manual width settings
import React from "react";
import _ from "lodash";

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

// TODO: move to separate file
const NOTE_ARRAY = [
  "c",
  "db",
  "d",
  "eb",
  "e",
  "f",
  "gb",
  "g",
  "ab",
  "a",
  "bb",
  "b"
];
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
    midiNumber: number
  };
}

function Key(props) {
  return (
    <div
      style={Object.assign(
        {
          position: "absolute",
          top: 0,
          left: props.left,
          width: props.width,
          height: props.height
        },
        props.style
      )}
    />
  );
}

class Piano extends React.Component {
  static defaultProps = {
    whiteKeyConfig: {
      widthRatio: 1,
      heightRatio: 1,
      style: {
        zIndex: 0,
        borderRadius: "0 0 4px 4px",
        border: "2px solid #999",
        background: "#fff"
      }
    },
    blackKeyConfig: {
      widthRatio: 0.66,
      heightRatio: 0.66,
      style: {
        zIndex: 1,
        borderRadius: "0 0 4px 4px",
        border: "2px solid #eee",
        background: "#555"
      }
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
      b: { offsetFromC: 6, isBlackKey: false }
    }
  };

  onClickKey = () => {
    // TODO
  };

  render() {
    const startNum = noteToMidiNumber(this.props.startNote);
    const midiNumbers = _.range(
      startNum,
      noteToMidiNumber(this.props.endNote) + 1
    );
    const numWhiteKeys = midiNumbers.filter(num => {
      const { basenote } = getMidiNumberAttributes(num);
      return !this.props.noteConfig[basenote].isBlackKey;
    }).length;
    const whiteKeyWidth = 1 / numWhiteKeys;
    const octaveWidth = 7;

    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {midiNumbers.map(num => {
          // TODO: refactor
          const { octave, basenote } = getMidiNumberAttributes(num);
          const noteConfig = this.props.noteConfig[basenote];
          const keyConfig = noteConfig.isBlackKey
            ? this.props.blackKeyConfig
            : this.props.whiteKeyConfig;
          const startNoteAttrs = getMidiNumberAttributes(startNum);
          const leftRatio =
            noteConfig.offsetFromC -
            this.props.noteConfig[startNoteAttrs.basenote].offsetFromC +
            octaveWidth * (octave - startNoteAttrs.octave);
          return (
            <Key
              left={ratioToPercentage(leftRatio * whiteKeyWidth)}
              width={ratioToPercentage(keyConfig.widthRatio * whiteKeyWidth)}
              height={ratioToPercentage(keyConfig.heightRatio)}
              style={keyConfig.style}
              key={num}
            />
          );
        })}
      </div>
    );
  }
}

export default Piano;
