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

// TODO: move width logic to pianomanager?
class PianoManager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keysDown: {},
      isMouseDown: false,
    };
  }

  componentDidMount() {
    // TODO: removeEventListener calls
    window.addEventListener('mousedown', () => {
      this.setState({
        isMouseDown: true,
      });
    });
    window.addEventListener('mouseup', () => {
      this.setState({
        isMouseDown: false,
      });
    });

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

  handleNoteDown = (noteAttrs) => {
    this.setState((prevState) => ({
      keysDown: Object.assign({}, prevState.keysDown, {
        [noteAttrs.midiNumber]: true,
      }),
    }));
    this.props.onNoteDown(noteAttrs);
  };

  handleNoteUp = (noteAttrs) => {
    this.setState((prevState) => ({
      keysDown: Object.assign({}, prevState.keysDown, {
        [noteAttrs.midiNumber]: false,
      }),
    }));
    this.props.onNoteUp(noteAttrs);
  };

  // TODO: use renderProps instead?
  render() {
    const { onNoteDown, onNoteUp, keyboardConfig, ...otherProps } = this.props;
    console.log('state', this.state);

    return (
      <Piano
        {...otherProps}
        keysDown={this.state.keysDown}
        gliss={this.state.isMouseDown}
        onNoteDown={this.handleNoteDown}
        onNoteUp={this.handleNoteUp}
      />
    );
  }
}

export default Piano;
