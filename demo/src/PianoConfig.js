import React from 'react';
import _ from 'lodash';
import { getMidiNumberAttributes, MIN_MIDI_NUMBER, MAX_MIDI_NUMBER } from 'react-piano';

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

function Label(props) {
  return <div className="mb-1 text-secondary">{props.children}</div>;
}

function PianoConfig(props) {
  const midiNumbersToNotes = _.range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).map(
    (midiNumber) => getMidiNumberAttributes(midiNumber).note,
  );

  function onChangeStartNote(event) {
    props.setConfig({
      startNote: parseInt(event.target.value, 10),
    });
  }

  function onChangeEndNote(event) {
    props.setConfig({
      endNote: parseInt(event.target.value, 10),
    });
  }

  const noteRange = _.range(MIN_MIDI_NUMBER, MAX_MIDI_NUMBER + 1).filter(
    (midiNumber) => !getMidiNumberAttributes(midiNumber).isAccidental,
  );

  const { startNote, endNote, instrumentName } = props.config;

  return (
    <div className="form-row">
      <div className="col-3">
        <Label>Start note</Label>
        <AutoblurSelect className="form-control" onChange={onChangeStartNote} value={startNote}>
          {noteRange.map((midiNumber) => (
            <option value={midiNumber} key={midiNumber}>
              {midiNumbersToNotes[midiNumber]}
            </option>
          ))}
        </AutoblurSelect>
      </div>
      <div className="col-3">
        <Label>End note</Label>
        <AutoblurSelect className="form-control" onChange={onChangeEndNote} value={endNote}>
          {noteRange.map((midiNumber) => (
            <option value={midiNumber} key={midiNumber}>
              {midiNumbersToNotes[midiNumber]}
            </option>
          ))}
        </AutoblurSelect>
      </div>
      <div className="col-6">
        <Label>Instrument</Label>
        <InstrumentPicker
          className="form-control"
          instrumentName={instrumentName}
          instrumentList={props.instrumentList}
          onChange={props.onChangeInstrument}
        />
      </div>
    </div>
  );
}

export default PianoConfig;
