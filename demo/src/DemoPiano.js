import React from 'react';
import { Piano, KeyboardShortcuts } from 'react-piano';

import DimensionsProvider from './DimensionsProvider';
import InstrumentListProvider from './InstrumentListProvider';
import SoundfontProvider from './SoundfontProvider';
import PianoConfig from './PianoConfig';

const soundfontHostname = 'http://d1pzp51pvbm36p.cloudfront.net';

class DemoPiano extends React.Component {
  state = {
    config: {
      instrumentName: SoundfontProvider.defaultProps.instrumentName,
      noteRange: {
        first: 48,
        last: 77,
      },
      keyboardShortcutOffset: 0,
    },
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
                    noteRange={this.state.config.noteRange}
                    keyboardShortcuts={keyboardShortcuts}
                    onPlayNote={playNote}
                    onStopNote={stopNote}
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
