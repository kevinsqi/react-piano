import React from 'react';
import { InputPiano } from 'react-piano';

class RecordingPiano extends React.Component {
  render() {
    return (
      <InputPiano
        playbackNotes={[66, 67, 68]}
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        keyboardShortcuts={this.props.keyboardShortcuts}
        onNoteStart={this.props.onNoteStart}
        onNoteStop={this.props.onNoteStop}
        isLoading={this.props.isLoading}
        width={this.props.width}
      />
    );
  }
}

export default RecordingPiano;
