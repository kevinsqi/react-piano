import React from 'react';
import { Piano, getMidiNumberAttributes } from 'react-piano';
import classNames from 'classnames';
// TODO: lodash.find
import _ from 'lodash';

class InputPiano extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: [],
      isMouseDown: false,
      touchEvents: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchstart', this.onTouchStart);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchstart', this.onTouchStart);
  }

  componentDidUpdate(prevProps) {
    // If keyboard shortcuts change, any activeNotes will not
    // correctly fire keyUp events. First cancel all activeNotes.
    if (prevProps.keyboardShortcuts !== this.props.keyboardShortcuts) {
      this.setState({
        activeNotes: [],
      });
    }
  }

  getMidiNumberForKey = (key) => {
    const shortcut = _.find(this.props.keyboardShortcuts, { key: key });
    return shortcut && shortcut.midiNumber;
  };

  getKeyForMidiNumber = (midiNumber) => {
    const shortcut = _.find(this.props.keyboardShortcuts, { midiNumber: midiNumber });
    return shortcut && shortcut.key;
  };

  onKeyDown = (event) => {
    if (!this.props.keyboardShortcuts) {
      return;
    }
    // Don't conflict with existing combinations like ctrl + t
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onNoteStart(midiNumber);
    }
  };

  onKeyUp = (event) => {
    if (!this.props.keyboardShortcuts) {
      return;
    }
    // Don't conflict with existing combinations like ctrl + t
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onNoteStop(midiNumber);
    }
  };

  onNoteStart = (midiNumber) => {
    if (this.props.isLoading) {
      return;
    }
    // Prevent duplicate note firings
    const isActive = this.state.activeNotes.includes(midiNumber);
    if (isActive) {
      return;
    }
    this.props.onNoteStart(midiNumber);
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.concat(midiNumber).sort(),
    }));
  };

  onNoteStop = (midiNumber) => {
    if (this.props.isLoading) {
      return;
    }
    const isInactive = !this.state.activeNotes.includes(midiNumber);
    if (isInactive) {
      return;
    }
    this.props.onNoteStop(midiNumber);
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
    }));
  };

  onMouseDown = () => {
    this.setState({
      isMouseDown: true,
    });
  };

  onMouseUp = () => {
    this.setState({
      isMouseDown: false,
    });
  };

  onTouchStart = () => {
    this.setState({
      touchEvents: true,
    });
  };

  renderNoteLabel = (midiNumber) => {
    const keyboardShortcut = this.getKeyForMidiNumber(midiNumber);
    if (!keyboardShortcut) {
      return null;
    }
    const { isAccidental } = getMidiNumberAttributes(midiNumber);
    return (
      <div className="text-center">
        <div
          className={classNames({
            'NoteLabel--black': isAccidental,
            'NoteLabel--white': !isAccidental,
          })}
        >
          {keyboardShortcut}
        </div>
      </div>
    );
  };

  render() {
    return (
      <Piano
        startNote={this.props.startNote}
        endNote={this.props.endNote}
        activeNotes={this.state.activeNotes}
        disabled={this.props.isLoading}
        width={this.props.width}
        gliss={this.state.isMouseDown}
        touchEvents={this.state.touchEvents}
        renderNoteLabel={this.renderNoteLabel}
        onNoteStart={this.onNoteStart}
        onNoteStop={this.onNoteStop}
      />
    );
  }
}

export default InputPiano;
