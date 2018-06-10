import React from 'react';
import PropTypes from 'prop-types';
import difference from 'lodash.difference';

import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

class Piano extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.notes !== prevProps.notes) {
      this.handleNoteChanges(prevProps.notes || [], this.props.notes || []);
    }
  }

  handleNoteChanges = (prevMidiNumbers, midiNumbers) => {
    const notesUp = difference(prevMidiNumbers, midiNumbers);
    const notesDown = difference(midiNumbers, prevMidiNumbers);
    notesUp.forEach((number) => {
      this.props.onNoteUp(number);
    });
    notesDown.forEach((number) => {
      this.props.onNoteDown(number);
    });
  };

  render() {
    return (
      <Keyboard
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        disabled={this.props.disabled}
        notes={this.props.notes}
        width={this.props.width}
        gliss={this.props.gliss}
        touchEvents={this.props.touchEvents}
        onNoteDown={this.props.onNoteDown}
        onNoteUp={this.props.onNoteUp}
        renderNoteLabel={this.props.renderNoteLabel}
      />
    );
  }
}

Piano.propTypes = {
  startNote: PropTypes.number.isRequired,
  endNote: PropTypes.number.isRequired,
  onNoteDown: PropTypes.func.isRequired,
  onNoteUp: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  notes: PropTypes.array,
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
