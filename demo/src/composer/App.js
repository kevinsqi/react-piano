import React from 'react';
import 'react-piano/build/styles.css';

import DimensionsProvider from './DimensionsProvider';
import Oscillator from './Oscillator';
import RecordingPiano from './RecordingPiano';

const audioContext = new window.AudioContext();

class OscillatorProvider extends React.Component {
  constructor(props) {
    super(props);

    this.oscillator = new Oscillator({
      audioContext: props.audioContext,
      gain: 0.2,
    });
  }

  startNote = (midiNumber) => {
    this.oscillator.start(midiNumber);
  };

  stopNote = (midiNumber) => {
    this.oscillator.stop(midiNumber);
  };

  render() {
    return this.props.children({
      startNote: this.startNote,
      stopNote: this.stopNote,
    });
  }
}

class App extends React.Component {
  render() {
    const range = {
      startNote: 48,
      endNote: 77,
    };
    return (
      <OscillatorProvider audioContext={audioContext}>
        {({ startNote, stopNote }) => (
          <DimensionsProvider>
            {({ containerWidth }) => (
              <RecordingPiano
                startNote={range.startNote}
                endNote={range.endNote}
                onNoteStart={startNote}
                onNoteStop={stopNote}
                width={containerWidth}
              />
            )}
          </DimensionsProvider>
        )}
      </OscillatorProvider>
    );
  }
}

export default App;
