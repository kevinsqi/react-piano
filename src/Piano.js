import React from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash.difference';

import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

class Piano extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges(prevProps.activeNotes || [], this.props.activeNotes || []);
    }
  }

  handleNoteChanges = (prevMidiNumbers, midiNumbers) => {
    // TODO: rename notesStart notesStop
    const notesUp = difference(prevMidiNumbers, midiNumbers);
    const notesDown = difference(midiNumbers, prevMidiNumbers);
    notesUp.forEach((number) => {
      this.props.onNoteStop(number);
    });
    notesDown.forEach((number) => {
      this.props.onNoteStart(number);
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
  width: PropTypes.number,
};

Piano.defaultProps = {
  disabled: false,
  gliss: false,
  touchEvents: false,
};

export default Piano;
