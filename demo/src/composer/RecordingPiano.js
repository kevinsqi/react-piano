import React from 'react';
import { InputPiano } from 'react-piano';

class RecordingPiano extends React.Component {
  state = {
    mode: 'recording',
    notesArray: [],
    index: 0,
  };

  // TODO: refactor
  getShiftedNotesArrayIndex = (value, base) => {
    if (base === 0) {
      return 0;
    }
    // Need to add base to prevent negative numbers
    return (this.state.index + value + base) % base;
  };

  onNoteStart = (midiNumber) => {
    this.props.onNoteStart(midiNumber);
  };

  onNoteStop = (midiNumber, prevActiveNotes) => {
    this.props.onNoteStop(midiNumber);
    this.onRecordNotes(prevActiveNotes);
  };

  onRecordNotes = (midiNumbers) => {
    if (this.state.mode === 'recording') {
      const notesArrayCopy = this.state.notesArray.slice();
      notesArrayCopy.splice(this.state.index + 1, 0, midiNumbers);
      this.setState({
        notesArray: notesArrayCopy,
        index: this.getShiftedNotesArrayIndex(1, notesArrayCopy.length),
      });
    }
  };

  render() {
    return (
      <div>
        <InputPiano
          startNote={this.props.startNote}
          endNote={this.props.endNote}
          playbackNotes={null}
          keyboardShortcuts={this.props.keyboardShortcuts}
          onNoteStart={this.onNoteStart}
          onNoteStop={this.onNoteStop}
          isLoading={this.props.isLoading}
          width={this.props.width}
        />
        <div>{JSON.stringify(this.state.notesArray)}</div>
      </div>
    );
  }
}

export default RecordingPiano;
