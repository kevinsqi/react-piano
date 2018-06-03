import React from 'react';
import _ from 'lodash';

import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

class Piano extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.notes !== prevProps.notes) {
      this.handleNoteChanges(prevProps.notes || [], this.props.notes || []);
    }
  }

  // TODO dedupe
  getMidiNumbers() {
    return _.range(this.props.startNote, this.props.endNote + 1);
  }

  handleNoteChanges = (prevMidiNumbers, midiNumbers) => {
    const notesUp = _.difference(prevMidiNumbers, midiNumbers);
    const notesDown = _.difference(midiNumbers, prevMidiNumbers);
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
        onNoteDown={this.props.onNoteDown}
        onNoteUp={this.props.onNoteUp}
        renderNoteLabel={this.props.renderNoteLabel}
      />
    );
  }
}

export default Piano;
