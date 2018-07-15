import React from 'react';
import { getMidiNumberAttributes, NATURAL_MIDI_NUMBERS } from 'react-piano';

const NUM_NOTES_IN_OCTAVE = 12;

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

function Label(props) {
  return <small className="mb-1 text-muted">{props.children}</small>;
}

class PianoConfig extends React.Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (event) => {
    const minOffset = 0;
    const maxOffset =
      this.props.config.endNote - this.props.config.firstNote - this.props.numKeyboardShortcuts;
    if (event.key === 'ArrowLeft') {
      const reducedOffset = this.props.config.keyboardShortcutOffset - NUM_NOTES_IN_OCTAVE;
      if (reducedOffset >= minOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: reducedOffset,
        });
      }
    } else if (event.key === 'ArrowRight') {
      const increasedOffset = this.props.config.keyboardShortcutOffset + NUM_NOTES_IN_OCTAVE;
      if (increasedOffset <= maxOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: increasedOffset,
        });
      }
    }
  };

  onChangeFirstNote = (event) => {
    this.props.setConfig({
      firstNote: parseInt(event.target.value, 10),
    });
  };

  onChangeEndNote = (event) => {
    this.props.setConfig({
      endNote: parseInt(event.target.value, 10),
    });
  };

  onChangeInstrument = (event) => {
    this.props.setConfig({
      instrumentName: event.target.value,
    });
  };

  render() {
    const midiNumbersToNotes = NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
      obj[midiNumber] = getMidiNumberAttributes(midiNumber).note;
      return obj;
    }, {});
    const { firstNote, endNote, instrumentName } = this.props.config;

    return (
      <div className="form-row">
        <div className="col-3">
          <Label>Start note</Label>
          <AutoblurSelect
            className="form-control"
            onChange={this.onChangeFirstNote}
            value={firstNote}
          >
            {NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} key={midiNumber}>
                {midiNumbersToNotes[midiNumber]}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-3">
          <Label>End note</Label>
          <AutoblurSelect className="form-control" onChange={this.onChangeEndNote} value={endNote}>
            {NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} key={midiNumber}>
                {midiNumbersToNotes[midiNumber]}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-6">
          <Label>Instrument</Label>
          <AutoblurSelect
            className="form-control"
            value={instrumentName}
            onChange={this.onChangeInstrument}
          >
            {this.props.instrumentList.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col mt-2">
          <small className="text-muted">
            Use <strong>left arrow</strong> and <strong>right arrow</strong> to move the keyboard
            shortcuts around.
          </small>
        </div>
      </div>
    );
  }
}

export default PianoConfig;
