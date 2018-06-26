import React from 'react';
import { Piano, getMidiNumberAttributes } from 'react-piano';
import classNames from 'classnames';
// TODO: lodash.range
import _ from 'lodash';

import DimensionsProvider from './DimensionsProvider';
import InputManager from './InputManager';

// TODO: have getMidiNumberForKey be passed as a prop function
class InputPiano extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeNotes: [],
      isMouseDown: false,
      touchEvents: false,
    };
  }

  // TODO dedupe
  getMidiNumbers() {
    return _.range(this.props.startNote, this.props.endNote + 1);
  }

  getMidiNumberForKey = (key) => {
    const mapping = this.props.keyboardShortcuts;
    return mapping[key];
  };

  getKeyForMidiNumber = (midiNumber) => {
    const mapping = this.props.keyboardShortcuts;
    for (let key in mapping) {
      if (mapping[key] === midiNumber) {
        return key;
      }
    }
    return null;
  };

  onKeyDown = (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }
    const midiNumber = this.getMidiNumberForKey(event.key);
    if (midiNumber) {
      this.onNoteStart(midiNumber);
    }
  };

  onKeyUp = (event) => {
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
    if (this.state.isPlaying) {
      this.props.onNoteStart(midiNumber);
    } else {
      // Prevent duplicate note firings
      const alreadyFired = this.state.activeNotes.includes(midiNumber);
      if (alreadyFired) {
        return;
      }
      this.props.onNoteStart(midiNumber);
      this.setState((prevState) => ({
        activeNotes: prevState.activeNotes.concat(midiNumber).sort(),
      }));
    }
  };

  onNoteStop = (midiNumber) => {
    if (this.props.isLoading) {
      return;
    }
    if (this.state.isPlaying) {
      this.props.onNoteStop(midiNumber);
    } else {
      const alreadyFired = !this.state.activeNotes.includes(midiNumber);
      if (alreadyFired) {
        return;
      }
      this.props.onNoteStop(midiNumber);
      this.setState((prevState) => ({
        activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
      }));
    }
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
      <div>
        <InputManager
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onTouchStart={this.onTouchStart}
        />
        <div>
          <DimensionsProvider>
            {(width) => (
              <Piano
                startNote={this.props.startNote}
                endNote={this.props.endNote}
                activeNotes={this.state.activeNotes}
                disabled={this.props.isLoading}
                width={width}
                gliss={this.state.isMouseDown}
                touchEvents={this.state.touchEvents}
                renderNoteLabel={this.renderNoteLabel}
                onNoteStart={this.onNoteStart}
                onNoteStop={this.onNoteStop}
              />
            )}
          </DimensionsProvider>
        </div>
      </div>
    );
  }
}

export default InputPiano;
