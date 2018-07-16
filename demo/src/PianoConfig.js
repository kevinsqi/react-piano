import React from 'react';
import { MidiNumbers } from 'react-piano';

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
    const numNotes = this.props.config.noteRange.last - this.props.config.noteRange.first + 1;
    const minOffset = 0;
    const maxOffset = numNotes - this.props.keyboardShortcuts.length;
    if (event.key === 'ArrowLeft') {
      const reducedOffset = this.props.config.keyboardShortcutOffset - 1;
      if (reducedOffset >= minOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: reducedOffset,
        });
      }
    } else if (event.key === 'ArrowRight') {
      const increasedOffset = this.props.config.keyboardShortcutOffset + 1;
      if (increasedOffset <= maxOffset) {
        this.props.setConfig({
          keyboardShortcutOffset: increasedOffset,
        });
      }
    }
  };

  onChangeFirstNote = (event) => {
    this.props.setConfig({
      noteRange: {
        first: parseInt(event.target.value, 10),
        last: this.props.config.noteRange.last,
      },
    });
  };

  onChangeLastNote = (event) => {
    this.props.setConfig({
      noteRange: {
        first: this.props.config.noteRange.first,
        last: parseInt(event.target.value, 10),
      },
    });
  };

  onChangeInstrument = (event) => {
    this.props.setConfig({
      instrumentName: event.target.value,
    });
  };

  render() {
    const midiNumbersToNotes = MidiNumbers.NATURAL_MIDI_NUMBERS.reduce((obj, midiNumber) => {
      obj[midiNumber] = MidiNumbers.getAttributes(midiNumber).note;
      return obj;
    }, {});
    const { noteRange, instrumentName } = this.props.config;

    return (
      <div className="form-row">
        <div className="col-3">
          <Label>First note</Label>
          <AutoblurSelect
            className="form-control"
            onChange={this.onChangeFirstNote}
            value={noteRange.first}
          >
            {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} disabled={midiNumber >= noteRange.last} key={midiNumber}>
                {midiNumbersToNotes[midiNumber]}
              </option>
            ))}
          </AutoblurSelect>
        </div>
        <div className="col-3">
          <Label>Last note</Label>
          <AutoblurSelect
            className="form-control"
            onChange={this.onChangeLastNote}
            value={noteRange.last}
          >
            {MidiNumbers.NATURAL_MIDI_NUMBERS.map((midiNumber) => (
              <option value={midiNumber} disabled={midiNumber <= noteRange.first} key={midiNumber}>
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
