import React from 'react';
import Piano from './Piano';
import { noteToMidiNumber, getMidiNumberAttributes } from './midiHelpers';

// TODO: refactor
function getKeyboardShortcutsForMidiNumbers(numbers, keyboardConfig) {
  if (!keyboardConfig) {
    return {};
  }
  let keyIndex = 0;
  const keysToMidiNumbers = {};
  for (let numIndex = 0; numIndex < numbers.length; numIndex += 1) {
    const num = numbers[numIndex];
    const { basenote, isAccidental } = getMidiNumberAttributes(num);

    const key = keyboardConfig[keyIndex];
    if (isAccidental) {
      keysToMidiNumbers[key.flat] = num;
    } else {
      keysToMidiNumbers[key.natural] = num;
      keyIndex += 1;

      if (keyIndex >= keyboardConfig.length) {
        break;
      }
    }
  }
  return keysToMidiNumbers;
}

class PianoManager extends React.Component {
  static defaultProps = {
    onRecordNotes: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      keysDown: {},
      isMouseDown: false,
      noteSequenceIndex: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
    if (this.props.keyboardConfig) {
      window.addEventListener('keydown', this.handleKeyDown);
      window.addEventListener('keyup', this.handleKeyUp);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
    if (this.props.keyboardConfig) {
      window.removeEventListener('keydown', this.handleKeyDown);
      window.removeEventListener('keyup', this.handleKeyUp);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // noreintegrate
    if (this.props.notes && this.props.notes !== prevProps.notes) {
      this.triggerNotesDown(prevProps.notes, this.props.notes);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // noreintegrate keysDown comparison
    if (nextProps.notes) {
      return {
        keysDown: nextProps.notes.reduce((obj, note) => {
          obj[note] = true;
          return obj;
        }, {}),
      };
    }
    return null;
  }

  // TODO dedupe
  getMidiNumbers() {
    const startNum = noteToMidiNumber(this.props.startNote);
    return _.range(startNum, noteToMidiNumber(this.props.endNote) + 1);
  }

  getMidiNumberForKey = (key) => {
    const mapping = getKeyboardShortcutsForMidiNumbers(
      this.getMidiNumbers(),
      this.props.keyboardConfig,
    );
    return mapping[key];
  };

  getKeyForMidiNumber = (midiNumber) => {
    const mapping = getKeyboardShortcutsForMidiNumbers(
      this.getMidiNumbers(),
      this.props.keyboardConfig,
    );
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

  handleMouseDown = (event) => {
    this.setState({
      isMouseDown: true,
    });
  };

  handleMouseUp = (event) => {
    this.setState({
      isMouseDown: false,
    });
  };

  handleNoteDown = (midiNumber) => {
    // Prevents duplicate note firings
    if (this.state.keysDown[midiNumber] || this.props.disabled) {
      return;
    }
    this.setState(
      (prevState) => ({
        keysDown: Object.assign({}, prevState.keysDown, {
          [midiNumber]: true,
        }),
      }),
      () => {
        const sortedNotes = Object.keys(this.state.keysDown)
          .filter((key) => this.state.keysDown[key])
          .map((key) => parseInt(key, 10))
          .sort();
        // Playback
        // noreintegrate
        if (!this.props.notes) {
          this.props.onRecordNotes(sortedNotes);
        }
      },
    );
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onNoteDown(attrs);
  };

  triggerNotesDown = (prevMidiNumbers, midiNumbers) => {
    (prevMidiNumbers || []).forEach((number) => {
      const attrs = getMidiNumberAttributes(number);
      this.props.onNoteUp(attrs);
    });
    midiNumbers.forEach((number) => {
      const attrs = getMidiNumberAttributes(number);
      this.props.onNoteDown(attrs);
    });
  };

  handleNoteUp = (midiNumber) => {
    if (!this.state.keysDown[midiNumber] || this.props.disabled) {
      return;
    }
    this.setState((prevState) => ({
      keysDown: Object.assign({}, prevState.keysDown, {
        [midiNumber]: false,
      }),
    }));
    const attrs = getMidiNumberAttributes(midiNumber);
    this.props.onNoteUp(attrs);
  };

  // TODO: use renderProps instead?
  render() {
    const { onNoteDown, onNoteUp, keyboardConfig, noteSequence, ...otherProps } = this.props;

    return (
      <Piano
        {...otherProps}
        keysDown={this.state.keysDown}
        gliss={this.state.isMouseDown}
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

export default PianoManager;
