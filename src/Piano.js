// noreintegrate can override sounds
// noreintegrate active notes
// noreintegrate startnote endnote
import React from "react";
import _ from "lodash";

function Key(props) {
  return (
    <div
      style={{
        backgroundColor: props.backgroundColor,
        border: `2px solid ${props.stroke}`,
        position: "absolute",
        top: 0,
        left: `${props.x}%`,
        width: `${props.width}%`,
        height: `${props.height}%`,
        borderRadius: "0 0 4px 4px"
      }}
    />
  );
}

const noteConfig = [
  {
    name: "c",
    offset: 0,
    isBlackKey: false
  },
  {
    name: "db",
    offset: 0.55,
    isBlackKey: true
  },
  {
    name: "d",
    offset: 1,
    isBlackKey: false
  },
  {
    name: "eb",
    offset: 1.8,
    isBlackKey: true
  },
  {
    name: "e",
    offset: 2,
    isBlackKey: false
  },
  {
    name: "f",
    offset: 3,
    isBlackKey: false
  },
  { name: "gb", offset: 3.5, isBlackKey: true }
  // blackKeyOffsets = [0.55, 1.8, 3.5, 4.7, 5.85].map(
];

class Piano extends React.Component {
  static defaultProps = {
    blackKeyConfig: {
      widthRatio: 0.66,
      heightRatio: 0.66
    }
  };

  onClickKey = () => {
    // TODO
  };

  render() {
    const notes = ["c", "db", "d", "eb", "e"];
    const notesToNoteConfigs = _.keyBy(noteConfig, "name");
    const configs = notes.map(note => notesToNoteConfigs[note]);

    const numWhiteKeys = 7; // noreintegrate get from mapping over notes
    // noreintegrate configure this from a config object too
    const whiteKeyHeight = 100;
    const whiteKeyWidth = 100 / numWhiteKeys;
    const blackKeyWidth = whiteKeyWidth * this.props.blackKeyConfig.widthRatio;
    const blackKeyHeight = 100 * this.props.blackKeyConfig.heightRatio;
    return (
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        {configs.map(config => {
          return (
            <Key
              x={config.offset * whiteKeyWidth}
              key={config.name}
              width={config.isBlackKey ? blackKeyWidth : whiteKeyWidth}
              height={config.isBlackKey ? blackKeyHeight : whiteKeyHeight}
              stroke={config.isBlackKey ? "#eee" : "#999"}
              backgroundColor={config.isBlackKey ? "#555" : "#fff"}
            />
          );
        })}
      </div>
    );
  }
}

export default Piano;
