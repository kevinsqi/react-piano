import React from 'react';
import PropTypes from 'prop-types';

class Key extends React.PureComponent {
  static propTypes = {
    left: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    onPlayNote: PropTypes.func.isRequired,
    onStopNote: PropTypes.func.isRequired,
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    className: PropTypes.string,
  };

  playNote = () => {
    this.props.onPlayNote(this.props.midiNumber);
  };

  stopNote = () => {
    this.props.onStopNote(this.props.midiNumber);
  };

  render() {
    const { className, left, width, height, gliss, useTouchEvents } = this.props;

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
        onMouseDown={useTouchEvents ? null : this.playNote}
        onMouseUp={useTouchEvents ? null : this.stopNote}
        onMouseEnter={gliss ? this.playNote : null}
        onMouseLeave={this.stopNote}
        onTouchStart={useTouchEvents ? this.playNote : null}
        onTouchCancel={useTouchEvents ? this.stopNote : null}
        onTouchEnd={useTouchEvents ? this.stopNote : null}
      >
        <div className="ReactPiano__NoteLabelContainer">
          {this.props.disabled
            ? null
            : this.props.renderNoteLabel({
                isActive: this.props.isActive,
                isAccidental: this.props.isAccidental,
                midiNumber: this.props.midiNumber,
              })}
        </div>
      </div>
    );
  }
}

export default Key;
