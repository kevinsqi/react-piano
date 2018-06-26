import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import _ from 'lodash';
import { getMidiNumberAttributes, MIN_MIDI_NUMBER, MAX_MIDI_NUMBER } from 'react-piano';
import 'react-piano/build/styles.css';

import Header from './Header';
import Footer from './Footer';
import InputPiano from './InputPiano';
import InstrumentProvider from './InstrumentProvider';
import KEYBOARD_CONFIGS from './keyboardConfigs';
import buildKeyboardShortcuts from './buildKeyboardShortcuts';
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

class AutoblurSelect extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  onChange = (event) => {
    this.props.onChange(event);
    this.selectRef.current.blur();
  };

  render() {
    const { children, onChange, ...otherProps } = this.props;
    return (
      <select {...otherProps} onChange={this.onChange} ref={this.selectRef}>
        {children}
      </select>
    );
  }
}

class InstrumentPicker extends React.Component {
  onChange = (event) => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <AutoblurSelect
        className={this.props.className}
        style={this.props.style}
        value={this.props.instrumentName}
        onChange={this.onChange}
      >
        {this.props.instrumentList.map((value) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </AutoblurSelect>
    );
  }
}

const audioContext = new window.AudioContext();

function getPianoConfig(startNote, endNote) {
  return {
    keyboardShortcuts: buildKeyboardShortcuts(startNote, KEYBOARD_CONFIGS.MIDDLE),
  };
}

function PianoConfig(props) {
  const midiNumbersToNotes = _.range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).map(
    (midiNumber) => getMidiNumberAttributes(midiNumber).note,
  );

  function onChangeStartNote(event) {
    props.setRange({
      startNote: parseInt(event.target.value, 10),
      endNote: props.range.endNote,
    });
  }

  function onChangeEndNote(event) {
    props.setRange({
      startNote: props.range.startNote,
      endNote: parseInt(event.target.value, 10),
    });
  }

  return (
    <div>
      <AutoblurSelect
        className="form-control"
        onChange={onChangeStartNote}
        value={props.range.startNote}
      >
        {_.range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).map((midiNumber) => (
          <option value={midiNumber} key={midiNumber}>
            {midiNumbersToNotes[midiNumber]}
          </option>
        ))}
      </AutoblurSelect>
      <AutoblurSelect
        className="form-control"
        onChange={onChangeEndNote}
        value={props.range.endNote}
      >
        {_.range(props.range.startNote + 1, MAX_MIDI_NUMBER + 1).map((midiNumber) => (
          <option value={midiNumber} key={midiNumber}>
            {midiNumbersToNotes[midiNumber]}
          </option>
        ))}
      </AutoblurSelect>
      <InstrumentPicker
        className="form-control"
        onChange={props.onChangeInstrument}
        instrumentName={props.instrumentName}
        instrumentList={props.instrumentList}
      />
    </div>
  );
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
                    <div className="text-center mt-5">
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
