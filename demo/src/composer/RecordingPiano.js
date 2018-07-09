import React from 'react';
import { InputPiano } from 'react-piano';
import _ from 'lodash';

class RecordingPiano extends React.Component {
  state = {
    playbackNotes: null,
  };

  // TODO: WIP
  componentDidMount() {
    let i = 0;
    const notes = _.range(this.props.startNote, this.props.endNote);
    setInterval(() => {
      this.setState({
        playbackNotes: [notes[i]],
      });
      i += 1;
    }, 1000);
  }

  render() {
    return (
      <InputPiano
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        playbackNotes={this.state.playbackNotes}
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
