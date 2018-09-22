import React from 'react';
import { Piano, KeyboardShortcuts, MidiNumbers } from 'react-piano';

import DimensionsProvider from './DimensionsProvider';
import InstrumentListProvider from './InstrumentListProvider';
import SoundfontProvider from './SoundfontProvider';
import PianoConfig from './PianoConfig';

const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

class DemoPiano extends React.Component {
  state = {
    config: {
      instrumentName: SoundfontProvider.defaultProps.instrumentName,
      noteRange: {
        first: MidiNumbers.fromNote('c3'),
        last: MidiNumbers.fromNote('f5'),
      },
      keyboardShortcutOffset: 0,
    },
    activeNotes: [],
  };

  createPlayNoteFunction = (playNoteFn) => {
    return (midiNumber) => {
      playNoteFn(midiNumber);
      this.setState((prevState) => ({
        activeNotes: prevState.activeNotes.concat(midiNumber).sort(),
      }));
    };
  };

  createStopNoteFunction = (stopNoteFn) => {
    return (midiNumber) => {
      stopNoteFn(midiNumber);
      this.setState((prevState) => ({
        activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
      }));
    };
  };

  render() {
    const keyboardShortcuts = KeyboardShortcuts.create({
      firstNote: this.state.config.noteRange.first + this.state.config.keyboardShortcutOffset,
      lastNote: this.state.config.noteRange.last + this.state.config.keyboardShortcutOffset,
      keyboardConfig: KeyboardShortcuts.HOME_ROW,
    });

    return (
      <SoundfontProvider
        audioContext={this.props.audioContext}
        instrumentName={this.state.config.instrumentName}
        hostname={soundfontHostname}
        render={({ isLoading, playNote, stopNote, stopAllNotes }) => (
          <div>
            <div>
              <DimensionsProvider>
                {({ containerWidth }) => (
                  <Piano
                    activeNotes={this.state.activeNotes}
                    noteRange={this.state.config.noteRange}
                    keyboardShortcuts={keyboardShortcuts}
                    onPlayNote={this.createPlayNoteFunction(playNote)}
                    onStopNote={this.createStopNoteFunction(stopNote)}
                    disabled={isLoading}
                    width={containerWidth}
                  />
                )}
              </DimensionsProvider>
            </div>
            <div className="row mt-5">
              <div className="col-lg-8 offset-lg-2">
                <InstrumentListProvider
                  hostname={soundfontHostname}
                  render={(instrumentList) => (
                    <PianoConfig
                      config={this.state.config}
                      setConfig={(config) => {
                        this.setState({
                          config: Object.assign({}, this.state.config, config),
                        });
                        stopAllNotes();
                      }}
                      instrumentList={instrumentList || [this.state.config.instrumentName]}
                      keyboardShortcuts={keyboardShortcuts}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        )}
      />
    );
  }
}

export default DemoPiano;
