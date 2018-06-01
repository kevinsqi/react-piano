import React from 'react';
import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

class Piano extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.notes !== prevProps.notes) {
      this.triggerNotesDown(prevProps.notes, this.props.notes);
    }
  }

  // TODO dedupe
  getMidiNumbers() {
    return _.range(this.props.startNote, this.props.endNote + 1);
  }

  // TODO: rename this more clearly relative to handleNoteDown
  // For triggering playback
  triggerNotesDown = (prevMidiNumbers, midiNumbers) => {
    (prevMidiNumbers || []).forEach((number) => {
      this.props.onNoteUp(number);
    });
    (midiNumbers || []).forEach((number) => {
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
        renderNoteLabel={
          () => {}
          /*
          (midiNumber) => {
            return this.props.renderNoteLabel(getMidiNumberAttributes(midiNumber), {
              keyboardShortcut: this.getKeyForMidiNumber(midiNumber),
            });
          }
          */
        }
      />
    );
  }
}

export default Piano;
