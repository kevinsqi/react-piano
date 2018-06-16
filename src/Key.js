import React from 'react';

class Key extends React.Component {
  render() {
    const {
      className,
      left,
      width,
      height,
      onNoteStart,
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
        onMouseDown={touchEvents ? null : onNoteStart}
        onMouseUp={touchEvents ? null : onNoteUp}
        onMouseEnter={gliss ? onNoteStart : null}
        onMouseLeave={gliss ? onNoteUp : null}
        onTouchStart={touchEvents ? onNoteStart : null}
        onTouchCancel={touchEvents ? onNoteUp : null}
        onTouchEnd={touchEvents ? onNoteUp : null}
      >
        <div style={{ alignSelf: 'flex-end', flex: 1 }}>{children}</div>
      </div>
    );
  }
}

export default Key;
