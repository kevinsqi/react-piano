import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Key extends React.PureComponent {
  static propTypes = {
    midiNumber: PropTypes.number.isRequired,
    left: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    accidental: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onPlayNote: PropTypes.func.isRequired,
    onStopNote: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  playNote = () => {
    this.props.onPlayNote(this.props.midiNumber);
  };

  stopNote = () => {
    this.props.onStopNote(this.props.midiNumber);
  };

  render() {
    const {
      midiNumber,
      left,
      width,
      height,
      gliss,
      useTouchEvents,
      accidental,
      active,
      disabled,
      children,
    } = this.props;

    // Need to conditionally include/exclude handlers based on useTouchEvents,
    // because otherwise mobile taps double fire events.
    return (
      <div
        className={classNames('ReactPiano__Key', {
          'ReactPiano__Key--black': accidental,
          'ReactPiano__Key--white': !accidental,
          'ReactPiano__Key--disabled': disabled,
          'ReactPiano__Key--active': active,
        })}
        style={{
          top: 0,
          left: left,
          width: width,
          height: height,
        }}
        onMouseDown={useTouchEvents ? null : this.playNote}
        onMouseUp={useTouchEvents ? null : this.stopNote}
        onMouseEnter={gliss ? this.playNote : null}
        onMouseLeave={this.stopNote}
        onTouchStart={useTouchEvents ? this.playNote : null}
        onTouchCancel={useTouchEvents ? this.stopNote : null}
        onTouchEnd={useTouchEvents ? this.stopNote : null}
      >
        <div className="ReactPiano__NoteLabelContainer">{children}</div>
      </div>
    );
  }
}

export default Key;
