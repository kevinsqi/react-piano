import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import { Piano, KeyboardShortcuts } from 'react-piano';
import 'react-piano/build/styles.css';

import DimensionsProvider from './DimensionsProvider';
import Header from './Header';
import Footer from './Footer';
import SoundfontProvider from './SoundfontProvider';
import PianoConfig from './PianoConfig';
import './App.css';

function Installation() {
  return (
    <div className="text-center">
      <h2>Installation</h2>
      <p className="mt-4">Install with yarn or npm:</p>
      <p className="mt-3">
        <code className="p-2 text-dark bg-yellow">yarn add react-piano</code>
      </p>
      <div className="mt-5">
        <a className="btn btn-info btn-lg" href="https://github.com/iqnivek/react-piano">
          View docs on Github
        </a>
      </div>
    </div>
  );
}

const audioContext = new window.AudioContext();

class App extends React.Component {
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
      <div>
        <Header />
        <div className="container">
          <div className="text-center mt-5">
            <p className="">Try it by clicking, tapping, or using your keyboard:</p>
            <div style={{ color: '#777' }}>
              <MdArrowDownward size={32} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-8 offset-md-2">
              <SoundfontProvider
                audioContext={audioContext}
                instrumentName={this.state.config.instrumentName}
                hostname="http://d1pzp51pvbm36p.cloudfront.net"
                render={({ isLoading, instrumentList, playNote, stopNote, stopAllNotes }) => (
                  <div>
                    <div>
                      <DimensionsProvider>
                        {({ containerWidth }) => (
                          <Piano
                            noteRange={this.state.config.noteRange}
                            keyboardShortcuts={keyboardShortcuts}
                            onPlayNote={playNote}
                            onStopNote={stopNote}
                            isLoading={isLoading}
                            width={containerWidth}
                          />
                        )}
                      </DimensionsProvider>
                    </div>
                    <div className="row mt-5">
                      <div className="col-lg-8 offset-lg-2">
                        <PianoConfig
                          config={this.state.config}
                          setConfig={(config) => {
                            this.setState({
                              config: Object.assign({}, this.state.config, config),
                            });
                            stopAllNotes();
                          }}
                          instrumentList={instrumentList}
                          keyboardShortcuts={keyboardShortcuts}
                        />
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <hr className="mt-5" />
          <div className="row mt-5">
            <div className="col">
              <Installation />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
