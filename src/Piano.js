import React from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash.difference';

import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

class Piano extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges({
        prevActiveNotes: prevProps.activeNotes || [],
        nextActiveNotes: this.props.activeNotes || [],
      });
    }
  }

  handleNoteChanges = ({ prevActiveNotes, nextActiveNotes }) => {
    const notesStarted = difference(prevActiveNotes, nextActiveNotes);
    const notesStopped = difference(nextActiveNotes, prevActiveNotes);
    notesStarted.forEach((midiNumber) => {
      this.props.onNoteStop(midiNumber);
    });
    notesStopped.forEach((midiNumber) => {
      this.props.onNoteStart(midiNumber);
    });
  };

  render() {
    return (
      <Keyboard
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        disabled={this.props.disabled}
        activeNotes={this.props.activeNotes}
        width={this.props.width}
        gliss={this.props.gliss}
        touchEvents={this.props.touchEvents}
        onNoteStart={this.props.onNoteStart}
        onNoteStop={this.props.onNoteStop}
        renderNoteLabel={this.props.renderNoteLabel}
      />
    );
  }
}

Piano.propTypes = {
  startNote: PropTypes.number.isRequired,
  endNote: PropTypes.number.isRequired,
  onNoteStart: PropTypes.func.isRequired,
  onNoteStop: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  activeNotes: PropTypes.array,
  gliss: PropTypes.bool,
  touchEvents: PropTypes.bool,
  renderNoteLabel: PropTypes.func,
  // If width is not provided, must have fixed width and height in parent container
  width: PropTypes.number,
};

Piano.defaultProps = {
  disabled: false,
  gliss: false,
  touchEvents: false,
};

export default Piano;
