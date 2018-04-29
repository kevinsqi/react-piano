// noreintegrate can override sounds
// noreintegrate active notes
// noreintegrate startnote endnote
import React from "react";

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
const MIDI_NOTE_C0 = 12;
const NOTE_REGEX = /(\w+)(\d)/;
const NOTES_IN_OCTAVE = 12;
function noteToMidiNumber(note) {
  const [, basenote, octave] = NOTE_REGEX.exec(note);
  const offset = NOTE_ARRAY.indexOf(basenote);
  return MIDI_NOTE_C0 + offset + NOTES_IN_OCTAVE * parseInt(octave, 10);
}

function Key(props) {
  return (
    <div
      style={{
        background: props.background,
        border: props.border,
        position: "absolute",
        top: 0,
        left: props.left,
        width: props.width,
        height: props.height,
        borderRadius: "0 0 4px 4px",
        zIndex: props.zIndex
      }}
    />
  );
}

class Piano extends React.Component {
  static defaultProps = {
    whiteKeyConfig: {
      widthRatio: 1,
      heightRatio: 1,
      border: "2px solid #999",
      background: "#fff",
      zIndex: 0
    },
    blackKeyConfig: {
      widthRatio: 0.66,
      heightRatio: 0.66,
      border: "2px solid #eee",
      background: "#555",
      zIndex: 1
    },
    // TODO: include MIDI note number https://en.wikipedia.org/wiki/Scientific_pitch_notation#Table_of_note_frequencies
    noteConfig: {
      c: { offset: 0, isBlackKey: false },
      db: { offset: 0.55, isBlackKey: true },
      d: { offset: 1, isBlackKey: false },
      eb: { offset: 1.8, isBlackKey: true },
      e: { offset: 2, isBlackKey: false },
      f: { offset: 3, isBlackKey: false },
      gb: { offset: 3.5, isBlackKey: true },
      g: { offset: 4, isBlackKey: false },
      ab: { offset: 4.7, isBlackKey: true },
      a: { offset: 5, isBlackKey: false },
      bb: { offset: 5.85, isBlackKey: true },
      b: { offset: 6, isBlackKey: false }
    }
  };

  onClickKey = () => {
    // TODO
  };

  render() {
    const notes = [
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

    const numWhiteKeys = notes.filter(
      note => !this.props.noteConfig[note].isBlackKey
    ).length;
    const whiteKeyWidth = 1 / numWhiteKeys;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {notes.map(note => {
          const noteConfig = this.props.noteConfig[note];
          const keyConfig = noteConfig.isBlackKey
            ? this.props.blackKeyConfig
            : this.props.whiteKeyConfig;
          return (
            <Key
              left={ratioToPercentage(noteConfig.offset * whiteKeyWidth)}
              width={ratioToPercentage(keyConfig.widthRatio * whiteKeyWidth)}
              height={ratioToPercentage(keyConfig.heightRatio)}
              border={keyConfig.border}
              background={keyConfig.background}
              zIndex={keyConfig.zIndex}
              key={note}
            />
          );
        })}
      </div>
    );
  }
}

export default Piano;
