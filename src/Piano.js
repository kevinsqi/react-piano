import React from "react";

function WhiteKey(props) {
  const width = 20;
  return (
    <rect
      stroke="#cccccc"
      fill="#ffffff"
      x={props.index * width}
      y={0}
      rx={3}
      width={width}
      height={100}
    />
  );
}

function Octave(props) {
  const width = 20;
  return (
    <g>
      <WhiteKey index={0} />
      <WhiteKey index={1} />
      <WhiteKey index={2} />
      <WhiteKey index={3} />
      <WhiteKey index={4} />
      <WhiteKey index={5} />
      <WhiteKey index={6} />
    </g>
  );
}

function Piano(props) {
  return (
    <svg viewBox="0 0 200 100">
      <Octave />
    </svg>
  );
}

export default Piano;
