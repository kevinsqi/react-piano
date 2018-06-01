import React from 'react';
import { Piano } from 'react-piano';
import classNames from 'classnames';

import Composer from './Composer';
import DimensionsProvider from './DimensionsProvider';
import InstrumentProvider from './InstrumentProvider';
import KEYBOARD_CONFIGS from './keyboardConfigs';
import InputManager from './InputManager';
import Oscillator from './Oscillator';
import SAMPLE_SONGS from './sampleSongs';

const audioContext = new window.AudioContext();

// TODO make component
function renderNoteLabel({ isAccidental }, { keyboardShortcut }) {
  if (!keyboardShortcut) {
    return null;
  }
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
}

class PianoComposer extends React.Component {
  constructor(props) {
    super(props);

    // TODO: split state into multiple components
    this.state = {
      isPlaying: false,
      isRecording: true,
      notesArray: [],
      notesArrayIndex: 0,
      input: {
        isMouseDown: false,
      },
    };

    this.oscillator = new Oscillator({
      audioContext,
      gain: 0.1,
    });

    this.playbackIntervalHandler = null;
  }

  componentDidMount() {
    this.loadNotes(SAMPLE_SONGS.lost_woods_theme);
  }

  // TODO: refactor
  getShiftedNotesArrayIndex = (value, base) => {
    if (base === 0) {
      return 0;
    }
    return (this.state.notesArrayIndex + value + base) % base; // Need to add base to prevent negative numbers
  };

  loadNotes = (notesArray) => {
    this.setState({
      notesArray,
      notesArrayIndex: notesArray.length - 1,
    });
  };

  onRecordNotes = (midiNumbers) => {
    if (this.state.isRecording) {
      const notesArrayCopy = this.state.notesArray.slice();
      notesArrayCopy.splice(this.state.notesArrayIndex + 1, 0, midiNumbers);
      this.setState({
        notesArray: notesArrayCopy,
        notesArrayIndex: this.getShiftedNotesArrayIndex(1, notesArrayCopy.length),
      });
    }
  };

  onAddRest = () => {
    this.onRecordNotes([]);
  };

  onDeleteNote = () => {
    if (!this.state.isPlaying) {
      // Delete note at notesArrayIndex
      const notesArrayCopy = this.state.notesArray.slice();
      notesArrayCopy.splice(this.state.notesArrayIndex, 1);
      this.setState({
        notesArray: notesArrayCopy,
        notesArrayIndex: this.getShiftedNotesArrayIndex(-1, notesArrayCopy.length),
      });
    }
  };

  onStepBackward = () => {
    this.setState({
      notesArrayIndex: this.getShiftedNotesArrayIndex(-1, this.state.notesArray.length),
    });
  };

  onStepForward = () => {
    this.setState({
      notesArrayIndex: this.getShiftedNotesArrayIndex(1, this.state.notesArray.length),
    });
  };

  onClear = () => {
    this.onStop();
    this.setState({
      notesArray: [],
      notesArrayIndex: 0,
    });
  };

  onPlay = (notesArray) => {
    if (this.state.isPlaying) {
      return;
    }
    this.setState({
      isPlaying: true,
      isRecording: false,
    });
    // TODO: configurable playback timing
    this.playbackIntervalHandler = setInterval(() => {
      this.setState({
        notesArrayIndex: this.getShiftedNotesArrayIndex(1, this.state.notesArray.length),
      });
    }, 250);
  };

  onStop = () => {
    clearInterval(this.playbackIntervalHandler);
    this.setState({
      isPlaying: false,
      isRecording: true,
      notesArrayIndex: this.state.notesArray.length - 1, // Set this to end of composition so can keep writing
    });
  };

  onKeyDown = (event) => {
    if (event.key === '-') {
      this.onAddRest();
    } else if (event.key === 'Backspace') {
      this.onDeleteNote();
    } else if (event.key === 'ArrowLeft') {
      this.onStepBackward();
    } else if (event.key === 'ArrowRight') {
      this.onStepForward();
    }
  };

  onMouseDown = () => {
    this.setState({
      input: Object.assign({}, this.state.input, {
        isMouseDown: true,
      }),
    });
  };

  onMouseUp = () => {
    this.setState({
      input: Object.assign({}, this.state.input, {
        isMouseDown: false,
      }),
    });
  };

  render() {
    return (
      <div>
        <InputManager
          onKeyDown={this.onKeyDown}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        />
        <div>
          <DimensionsProvider>
            {(width) => (
              <InstrumentProvider audioContext={audioContext}>
                {({ isLoading, onNoteDown, onNoteUp }) => (
                  <Piano
                    startNote="c4"
                    endNote="c6"
                    notes={
                      this.state.isPlaying
                        ? this.state.notesArray[this.state.notesArrayIndex]
                        : null
                    }
                    onNoteDown={onNoteDown}
                    onNoteUp={onNoteUp}
                    disabled={!isLoading}
                    keyboardConfig={KEYBOARD_CONFIGS.MIDDLE}
                    width={width}
                    gliss={this.state.input.isMouseDown}
                    renderNoteLabel={renderNoteLabel}
                    onRecordNotes={this.onRecordNotes}
                  />
                )}
              </InstrumentProvider>
            )}
          </DimensionsProvider>
        </div>
        <Composer
          className="Composer mt-3"
          isPlaying={this.state.isPlaying}
          notesArray={this.state.notesArray}
          notesArrayIndex={this.state.notesArrayIndex}
          onAddRest={this.onAddRest}
          onDeleteNote={this.onDeleteNote}
          onClear={this.onClear}
          onPlay={this.onPlay}
          onStop={this.onStop}
          onStepForward={this.onStepForward}
          onStepBackward={this.onStepBackward}
        />
      </div>
    );
  }
}

export default PianoComposer;
