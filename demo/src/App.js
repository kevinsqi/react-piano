import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import 'react-piano/build/styles.css';

import buildKeyboardShortcuts from './buildKeyboardShortcuts';
import Header from './Header';
import Footer from './Footer';
import InputPiano from './InputPiano';
import InstrumentProvider from './InstrumentProvider';
import KEYBOARD_CONFIGS from './keyboardConfigs';
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

function getPianoConfig(startNote, endNote) {
  return {
    keyboardShortcuts: buildKeyboardShortcuts(startNote, KEYBOARD_CONFIGS.MIDDLE),
  };
}

class App extends React.Component {
  state = {
    range: {
      startNote: 55,
      endNote: 79,
    },
  };

  render() {
    const { keyboardShortcuts } = getPianoConfig(
      this.state.range.startNote,
      this.state.range.endNote,
    );

    return (
      <div>
        <Header />
        <div className="container">
          <div className="text-center mt-5">
            <p className="">Try it by clicking, tapping, or using your keyboard</p>
            <div style={{ color: '#777' }}>
              <MdArrowDownward size={32} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-8 offset-md-2">
              <InstrumentProvider
                audioContext={audioContext}
                hostname="http://d1pzp51pvbm36p.cloudfront.net"
              >
                {({
                  isLoading,
                  instrumentList,
                  instrumentName,
                  onChangeInstrument,
                  onNoteStart,
                  onNoteStop,
                }) => (
                  <div>
                    <div>
                      <InputPiano
                        startNote={this.state.range.startNote}
                        endNote={this.state.range.endNote}
                        keyboardShortcuts={keyboardShortcuts}
                        onNoteStart={onNoteStart}
                        onNoteStop={onNoteStop}
                        isLoading={isLoading}
                      />
                    </div>
                    <div className="row mt-5">
                      <div className="col-md-8 offset-md-2">
                        <PianoConfig
                          range={this.state.range}
                          setRange={(range) => {
                            this.setState({ range });
                          }}
                          onChangeInstrument={onChangeInstrument}
                          instrumentName={instrumentName}
                          instrumentList={instrumentList}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </InstrumentProvider>
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
