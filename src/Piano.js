// noreintegrate can override sounds
// noreintegrate active notes
// noreintegrate startnote endnote
import React from "react";
import _ from "lodash";

function WhiteKey(props) {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        border: "2px solid #999",
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

function BlackKey(props) {
  return (
    <div
      style={{
        backgroundColor: "#555",
        stroke: "2px solid #eee",
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

function Piano(props) {
  const maxWidth = 100;
  const maxHeight = 100;
  const numWhiteKeys = 7;
  const whiteKeyWidth = maxWidth / numWhiteKeys;
  const whiteKeyHeight = maxHeight;
  const blackKeyWidth = whiteKeyWidth * 0.65;
  const blackKeyHeight = maxHeight * 0.66;
  const blackKeyOffsets = [0.55, 1.8, 3.5, 4.7, 5.85].map(
    index => whiteKeyWidth * index
  );
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {_.range(numWhiteKeys).map(index => (
        <WhiteKey
          x={index * whiteKeyWidth}
          width={whiteKeyWidth}
          height={whiteKeyHeight}
          key={index}
        />
      ))}
      {blackKeyOffsets.map(offset => (
        <BlackKey x={offset} width={blackKeyWidth} height={blackKeyHeight} />
      ))}
    </div>
  );
}

export default Piano;
