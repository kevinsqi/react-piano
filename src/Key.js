import React from 'react';
import PropTypes from 'prop-types';

class Key extends React.Component {
  static propTypes = {
    left: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  render() {
    const {
      className,
      left,
      width,
      height,
      playNote,
      stopNote,
      gliss,
      children,
      useTouchEvents,
    } = this.props;

    // Need to conditionally include/exclude handlers based on useTouchEvents,
    // because otherwise mobile taps double fire events.
    return (
      <div
        className={className}
        style={{
          top: 0,
          left: left,
          width: width,
          height: height,
        }}
        onMouseDown={useTouchEvents ? null : playNote}
        onMouseUp={useTouchEvents ? null : stopNote}
        onMouseEnter={gliss ? playNote : null}
        onMouseLeave={stopNote}
        onTouchStart={useTouchEvents ? playNote : null}
        onTouchCancel={useTouchEvents ? stopNote : null}
        onTouchEnd={useTouchEvents ? stopNote : null}
      >
        <div className="ReactPiano__NoteLabelContainer">{children}</div>
      </div>
    );
  }
}

export default Key;
