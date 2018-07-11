import React from 'react';
import PropTypes from 'prop-types';

class Key extends React.Component {
  static propTypes = {
    left: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    onNoteStart: PropTypes.func.isRequired,
    onNoteStop: PropTypes.func.isRequired,
    gliss: PropTypes.bool.isRequired,
    touchEvents: PropTypes.bool.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
  };

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
          top: 0,
          left: left,
          width: width,
          height: height,
        }}
        onMouseDown={touchEvents ? null : onNoteStart}
        onMouseUp={touchEvents ? null : onNoteStop}
        onMouseEnter={gliss ? onNoteStart : null}
        onMouseLeave={onNoteStop}
        onTouchStart={touchEvents ? onNoteStart : null}
        onTouchCancel={touchEvents ? onNoteStop : null}
        onTouchEnd={touchEvents ? onNoteStop : null}
      >
        <div className="ReactPiano__NoteLabelContainer">{children}</div>
      </div>
    );
  }
}

export default Key;
