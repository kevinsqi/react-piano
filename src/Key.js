import React from 'react';

class Key extends React.Component {
  render() {
    const {
      className,
      left,
      width,
      height,
      onNoteDown,
      onNoteUp,
      gliss,
      children,
      touchEvents,
    } = this.props;

    return (
      <div
        className={className}
        style={{
          position: 'absolute',
          top: 0,
          left: left,
          width: width,
          height: height,
          display: 'flex',
        }}
        onMouseDown={touchEvents ? null : onNoteDown}
        onMouseUp={touchEvents ? null : onNoteUp}
        onMouseEnter={gliss ? onNoteDown : null}
        onMouseLeave={gliss ? onNoteUp : null}
        onTouchStart={touchEvents ? onNoteDown : null}
        onTouchCancel={touchEvents ? onNoteUp : null}
        onTouchEnd={touchEvents ? onNoteUp : null}
      >
        <div style={{ alignSelf: 'flex-end', flex: 1 }}>{children}</div>
      </div>
    );
  }
}

export default Key;
