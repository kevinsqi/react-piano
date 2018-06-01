import React from 'react';
import Keyboard from './Keyboard';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';
import { getKeyboardShortcutMapping } from './keyboardShortcuts';

class Piano extends React.Component {
  static defaultProps = {
    onRecordNotes: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      notes: [],
      isRecorded: false,
    };
  }

  componentDidMount() {
    if (this.props.keyboardConfig) {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    if (this.props.keyboardConfig) {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.notes !== prevProps.notes) {
      this.triggerNotesDown(prevProps.notes, this.props.notes);
    }
  }

  // TODO dedupe
  getMidiNumbers() {
    const startNum = noteToMidiNumber(this.props.startNote);
    return _.range(startNum, noteToMidiNumber(this.props.endNote) + 1);
  }

  getMidiNumberForKey = (key) => {
    const mapping = getKeyboardShortcutMapping(this.getMidiNumbers(), this.props.keyboardConfig);
    return mapping[key];
  };

  getKeyForMidiNumber = (midiNumber) => {
    const mapping = getKeyboardShortcutMapping(this.getMidiNumbers(), this.props.keyboardConfig);
    for (let key in mapping) {
      if (mapping[key] === midiNumber) {
        return key;
      }
    }
    return null;
  };

  handleKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.handleNoteDown(midiNumber);
    }
  };

  handleKeyUp = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.handleNoteUp(midiNumber);
    }
  };

  handleNoteDown = (midiNumber) => {
    // Prevents duplicate note firings
    if (this.state.notes.includes(midiNumber) || this.props.disabled) {
      return;
    }
    this.setState((prevState) => ({
      notes: prevState.notes.concat(midiNumber).sort(),
      isRecorded: false,
    }));
    this.props.onNoteDown(midiNumber);
  };

  handleNoteUp = (midiNumber) => {
    if (!this.state.notes.includes(midiNumber) || this.props.disabled) {
      return;
    }
    // When playing a chord, record when the first note is released, and
    // stop recording subsequent note releases, UNLESS a new note is added
    const willRecord = this.state.isRecorded === false;
    if (willRecord) {
      this.props.onRecordNotes(this.state.notes);
    }
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => midiNumber !== note),
      isRecorded: this.state.isRecorded || willRecord,
    }));
    this.props.onNoteUp(midiNumber);
  };

  // TODO: rename this more clearly relative to handleNoteDown
  // For triggering playback
  triggerNotesDown = (prevMidiNumbers, midiNumbers) => {
    (prevMidiNumbers || []).forEach((number) => {
      this.props.onNoteUp(number);
    });
    (midiNumbers || []).forEach((number) => {
      this.props.onNoteDown(number);
    });
  };

  render() {
    return (
      <Keyboard
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        disabled={this.props.disabled}
        notes={this.props.notes || this.state.notes}
        width={this.props.width}
        gliss={this.props.gliss}
        onNoteDown={this.handleNoteDown}
        onNoteUp={this.handleNoteUp}
        renderNoteLabel={(midiNumber) => {
          return this.props.renderNoteLabel(getMidiNumberAttributes(midiNumber), {
            keyboardShortcut: this.getKeyForMidiNumber(midiNumber),
          });
        }}
      />
    );
  }
}

export default Piano;
