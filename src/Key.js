import React from 'react';

function Key(props) {
  return (
    <div
      className={props.className}
      style={{
        position: 'absolute',
        top: 0,
        left: props.left,
        width: props.width,
        height: props.height,
        display: 'flex',
      }}
      onMouseDown={props.onNoteDown}
      onMouseUp={props.onNoteUp}
      onMouseEnter={props.gliss ? props.onNoteDown : null}
      onMouseLeave={props.gliss ? props.onNoteUp : null}
      onTouchStart={props.onNoteDown}
      onTouchCancel={props.onNoteUp}
      onTouchEnd={props.onNoteUp}
    >
      <div style={{ alignSelf: 'flex-end', flex: 1 }}>{props.children}</div>
    </div>
  );
}

export default Key;
