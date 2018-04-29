import React from "react";
import _ from "lodash";

function WhiteKey(props) {
  return (
    <rect
      stroke="#aaaaaa"
      fill="#ffffff"
      x={props.x}
      y={0}
      rx={3}
      width={props.width}
      height={props.height}
    />
  );
}

function BlackKey(props) {
  const topOverflow = 3;
  return (
    <rect
      stroke="#ccc"
      fill="#666"
      x={props.x}
      y={-topOverflow}
      rx={3}
      width={props.width}
      height={props.height + topOverflow}
    />
  );
}

function Octave(props) {
  const numWhiteKeys = 7;
  const whiteKeyWidth = props.width / numWhiteKeys;
  const blackKeyWidth = whiteKeyWidth * 0.65;
  const blackKeyHeight = props.height * 0.66;
  const blackKeyOffsets = [0.55, 1.8, 3.5].map(index => whiteKeyWidth * index);
  return (
    <g>
      {_.range(7).map(index => (
        <WhiteKey
          x={index * whiteKeyWidth}
          width={whiteKeyWidth}
          height={props.height}
          key={index}
        />
      ))}
      {blackKeyOffsets.map(offset => (
        <BlackKey x={offset} width={blackKeyWidth} height={blackKeyHeight} />
      ))}
    </g>
  );
}

function Piano(props) {
  const border = 4;
  const viewBox = `0 0 ${props.width + border} ${props.height + border}`;
  return (
    <svg viewBox={viewBox}>
      <g x={border / 2} y={border / 2}>
        <Octave width={props.width} height={props.height} />
      </g>
    </svg>
  );
}

export default Piano;
