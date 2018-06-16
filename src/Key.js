import React from 'react';

class Key extends React.Component {
  render() {
    const {
      className,
      left,
      width,
      height,
      onNoteStart,
      onNoteStop,
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
        onMouseUp={touchEvents ? null : onNoteStop}
        onMouseEnter={gliss ? onNoteStart : null}
        onMouseLeave={gliss ? onNoteStop : null}
        onTouchStart={touchEvents ? onNoteStart : null}
        onTouchCancel={touchEvents ? onNoteStop : null}
        onTouchEnd={touchEvents ? onNoteStop : null}
      >
        <div style={{ alignSelf: 'flex-end', flex: 1 }}>{children}</div>
      </div>
    );
  }
}

export default Key;
