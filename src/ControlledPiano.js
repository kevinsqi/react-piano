import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import Keyboard from './Keyboard';

class ControlledPiano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    onPlayNote: PropTypes.func.isRequired,
    onStopNote: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

  static defaultProps = {
    renderNoteLabel: ({ keyboardShortcut, midiNumber, isActive, isAccidental }) =>
      keyboardShortcut ? (
        <div
          className={classNames('ReactPiano__NoteLabel', {
            'ReactPiano__NoteLabel--active': isActive,
            'ReactPiano__NoteLabel--accidental': isAccidental,
            'ReactPiano__NoteLabel--natural': !isAccidental,
          })}
        >
          {keyboardShortcut}
        </div>
      ) : null,
  };

  constructor(props) {
    super(props);

    this.state = {
      isMouseDown: false,
      useTouchEvents: false,
    };
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.activeNotes !== prevProps.activeNotes) {
      this.handleNoteChanges({
        prevActiveNotes: prevProps.activeNotes || [],
        nextActiveNotes: this.props.activeNotes || [],
      });
    }
  }

  handleNoteChanges = ({ prevActiveNotes, nextActiveNotes }) => {
    const notesStarted = difference(prevActiveNotes, nextActiveNotes);
    const notesStopped = difference(nextActiveNotes, prevActiveNotes);
    notesStarted.forEach((midiNumber) => {
      this.onStopNote(midiNumber);
    });
    notesStopped.forEach((midiNumber) => {
      this.onPlayNote(midiNumber);
    });
  };

  getMidiNumberForKey = (key) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.key === key);
    return shortcut && shortcut.midiNumber;
  };

  getKeyForMidiNumber = (midiNumber) => {
    if (!this.props.keyboardShortcuts) {
      return null;
    }
    const shortcut = this.props.keyboardShortcuts.find((sh) => sh.midiNumber === midiNumber);
    return shortcut && shortcut.key;
  };

  onKeyDown = (event) => {
    // Don't conflict with existing combinations like ctrl + t
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onPlayNote(midiNumber);
    }
  };

  onKeyUp = (event) => {
    // This *should* also check for event.ctrlKey || event.metaKey || event.ShiftKey like onKeyDown does,
    // but at least on Mac Chrome, when mashing down many alphanumeric keystrokes at once,
    // ctrlKey is fired unexpectedly, which would cause onStopNote to NOT be fired, which causes problematic
    // lingering notes. Since it's fairly safe to call onStopNote even when not necessary,
    // the ctrl/meta/shift check is removed to fix that issue.
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onStopNote(midiNumber);
    }
  };

  onPlayNote = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    // Prevent duplicate note firings
    const isActive = this.props.activeNotes.includes(midiNumber);
    if (isActive) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onPlayNote(midiNumber, this.props.activeNotes);
  };

  onStopNote = (midiNumber) => {
    if (this.props.disabled) {
      return;
    }
    const isInactive = !this.props.activeNotes.includes(midiNumber);
    if (isInactive) {
      return;
    }
    // Pass in previous activeNotes for recording functionality
    this.props.onStopNote(midiNumber, this.props.activeNotes);
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
      useTouchEvents: true,
    });
  };

  renderNoteLabel = ({ midiNumber, isActive, isAccidental }) => {
    const keyboardShortcut = this.getKeyForMidiNumber(midiNumber);
    return this.props.renderNoteLabel({ keyboardShortcut, midiNumber, isActive, isAccidental });
  };

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onTouchStart={this.onTouchStart}
        data-testid="container"
      >
        <Keyboard
          noteRange={this.props.noteRange}
          onPlayNote={this.onPlayNote}
          onStopNote={this.onStopNote}
          activeNotes={this.props.activeNotes}
          className={this.props.className}
          disabled={this.props.disabled}
          width={this.props.width}
          keyWidthToHeight={this.props.keyWidthToHeight}
          gliss={this.state.isMouseDown}
          useTouchEvents={this.state.useTouchEvents}
          renderNoteLabel={this.renderNoteLabel}
        />
      </div>
    );
  }
}

export default ControlledPiano;
