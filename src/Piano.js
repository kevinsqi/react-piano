// noreintegrate can override sounds
// noreintegrate active notes
// noreintegrate startnote endnote
import React from "react";

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

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
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

    const numWhiteKeys = 7; // noreintegrate get from mapping over notes
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
