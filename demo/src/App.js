import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import _ from 'lodash';
import 'react-piano/build/styles.css';

import Header from './Header';
import Footer from './Footer';
import InputPiano from './InputPiano';
import InstrumentProvider from './InstrumentProvider';
import KEYBOARD_CONFIGS from './keyboardConfigs';
import buildKeyboardShortcuts from './buildKeyboardShortcuts';
import './App.css';

const MAX_MIDI_NUMBER = 127;

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

class InstrumentPicker extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  onChange = (event) => {
    this.props.onChange(event.target.value);
    this.selectRef.current.blur();
  };

  render() {
    return (
      <select
        className={this.props.className}
        style={this.props.style}
        value={this.props.instrumentName}
        onChange={this.onChange}
        ref={this.selectRef}
      >
        {this.props.instrumentList.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    );
  }
}

const audioContext = new window.AudioContext();

function getPianoConfig(startNote, endNote) {
  return {
    keyboardShortcuts: buildKeyboardShortcuts(startNote, KEYBOARD_CONFIGS.MIDDLE),
  };
}

class App extends React.Component {
  state = {
    startNote: 55,
    endNote: 79,
  };

  render() {
    const { keyboardShortcuts } = getPianoConfig(this.state.startNote, this.state.endNote);

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
                        startNote={this.state.startNote}
                        endNote={this.state.endNote}
                        keyboardShortcuts={keyboardShortcuts}
                        onNoteStart={onNoteStart}
                        onNoteStop={onNoteStop}
                        isLoading={isLoading}
                      />
                    </div>
                    <div className="text-center mt-5">
                      <select
                        className="form-control"
                        onChange={(event) =>
                          this.setState({ startNote: parseInt(event.target.value, 10) })
                        }
                        value={this.state.startNote}
                      >
                        {_.range(12, MAX_MIDI_NUMBER + 1).map((midiNumber) => (
                          <option value={midiNumber}>{midiNumber}</option>
                        ))}
                      </select>
                      <select
                        className="form-control"
                        onChange={(event) =>
                          this.setState({ endNote: parseInt(event.target.value, 10) })
                        }
                        value={this.state.endNote}
                      >
                        {_.range(this.state.startNote + 1, MAX_MIDI_NUMBER + 1).map(
                          (midiNumber) => <option value={midiNumber}>{midiNumber}</option>,
                        )}
                      </select>
                      <InstrumentPicker
                        className="form-control"
                        onChange={onChangeInstrument}
                        instrumentName={instrumentName}
                        instrumentList={instrumentList}
                      />
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
