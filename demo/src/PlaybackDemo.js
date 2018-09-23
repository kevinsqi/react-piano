import React from 'react';
import { Piano, MidiNumbers } from 'react-piano';

import DimensionsProvider from './DimensionsProvider';
import SoundfontProvider from './SoundfontProvider';

const lostWoodsSong = [
  [65],
  [69],
  [71],
  [],
  [65],
  [69],
  [71],
  [],
  [65],
  [69],
  [71],
  [76],
  [74],
  [],
  [71],
  [72],
  [71],
  [67],
  [64],
  [],
  [],
  [],
  [],
  [62],
  [64],
  [67],
  [64],
  [],
  [],
  [],
  [],
  [],
];

class PlaybackDemo extends React.Component {
  state = {
    activeNotes: [],
    activeNotesIndex: 0,
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        activeNotes: lostWoodsSong[this.state.activeNotesIndex],
        activeNotesIndex: (this.state.activeNotesIndex + 1) % lostWoodsSong.length,
      });
    }, 250);
  }

  render() {
    const noteRange = {
      first: MidiNumbers.fromNote('c3'),
      last: MidiNumbers.fromNote('f5'),
    };

    return (
      <div>
        <SoundfontProvider
          audioContext={this.props.audioContext}
          instrumentName="acoustic_grand_piano"
          hostname={this.props.soundfontHostname}
          render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
            <DimensionsProvider>
              {({ containerWidth }) => (
                <Piano
                  activeNotes={this.state.activeNotes}
                  noteRange={noteRange}
                  width={containerWidth}
                  onPlayNote={playNote}
                  onStopNote={stopNote}
                  disabled={isLoading}
                />
              )}
            </DimensionsProvider>
          )}
        />
      </div>
    );
  }
}

export default PlaybackDemo;
