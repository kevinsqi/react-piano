import React from 'react';
import { InputPiano } from 'react-piano';

class RecordingPiano extends React.Component {
  state = {
    notesArray: [[66], [67], [68]],
    playbackIndex: 0,
  };

  // TODO: WIP
  componentDidMount() {
    setInterval(() => {
      this.setState({
        playbackIndex: (this.state.playbackIndex + 1) % this.state.notesArray.length,
      });
    }, 1000);
  }

  onNoteStart(midiNumber) {}

  render() {
    return (
      <InputPiano
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        playbackNotes={this.state.notesArray[this.state.playbackIndex]}
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
