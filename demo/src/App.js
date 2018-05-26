import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import { Piano } from 'react-piano';
import 'react-piano/build/styles.css';
import classNames from 'classnames';
import Soundfont from 'soundfont-player';

import Composer from './Composer';
import DimensionsProvider from './DimensionsProvider';
import Header from './Header';
import Footer from './Footer';
import KEYBOARD_CONFIGS from './keyboardConfigs';
import Oscillator from './Oscillator';
import SAMPLE_SONGS from './sampleSongs';
import './App.css';

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

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeAudioNodes: {},
      instrument: null,
      isPlaying: false,
      isRecording: true,
      notesArray: [],
      notesArrayIndex: 0,
    };

    this.oscillator = new Oscillator({
      audioContext,
      gain: 0.1,
    });

    this.playbackIntervalHandler = null;
  }

  componentDidMount() {
    this.loadInstrument();
    this.loadNotes(SAMPLE_SONGS.lost_woods_theme);
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  // TODO: refactor
  getShiftedNotesArrayIndex = (value, base) => {
    if (base === 0) {
      return 0;
    }
    console.log('getShiftedNotesArrayIndex', value, base);
    return (this.state.notesArrayIndex + value + base) % base; // Need to add base to prevent negative numbers
  };

  handleKeyDown = (event) => {
    // TODO: refactor this into keyboardConfig
    if (event.key === '-') {
      this.onRecordNotes([]);
    } else if (event.key === 'Backspace') {
      if (!this.state.isPlaying) {
        // Delete note at notesArrayIndex
        const notesArrayCopy = this.state.notesArray.slice();
        notesArrayCopy.splice(this.state.notesArrayIndex, 1);
        this.setState({
          notesArray: notesArrayCopy,
          notesArrayIndex: this.getShiftedNotesArrayIndex(-1, notesArrayCopy.length),
        });
      }
    } else if (event.key === 'ArrowLeft') {
      this.setState({
        notesArrayIndex: this.getShiftedNotesArrayIndex(-1, this.state.notesArray.length),
      });
    } else if (event.key === 'ArrowRight') {
      this.setState({
        notesArrayIndex: this.getShiftedNotesArrayIndex(1, this.state.notesArray.length),
      });
    }
  };

  loadNotes = (notesArray) => {
    this.setState({
      notesArray,
      notesArrayIndex: notesArray.length - 1,
    });
  };

  loadInstrument = () => {
    // Sound names here: http://gleitz.github.io/midi-js-soundfonts/MusyngKite/names.json
    Soundfont.instrument(audioContext, 'acoustic_grand_piano', {
      nameToUrl: (name, soundfont, format) => {
        return `${window.location.pathname}soundfonts/${name}-mp3.js`;
      },
    }).then((instrument) => {
      this.setState({
        instrument,
      });
    });
  };

  onNoteDown = ({ midiNumber, frequency }) => {
    audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
      // TODO: add back oscillator
    });
  };

  onNoteUp = ({ midiNumber, frequency }) => {
    audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      // TODO: refactor
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      const activeAudioNodes = Object.assign({}, this.state.activeAudioNodes);
      delete activeAudioNodes[midiNumber];
      this.setState({
        activeAudioNodes,
      });
      // TODO: add back oscillator
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

  onStop = () => {
    clearInterval(this.playbackIntervalHandler);
    this.setState({
      isPlaying: false,
      isRecording: true,
      notesArrayIndex: this.state.notesArray.length - 1, // Set this to end of composition so can keep writing
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="text-center mt-5">
            <p className="">Try it by clicking, tapping, or using your keyboard</p>
            <div style={{ color: '#777' }}>
              <MdArrowDownward size={32} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-8 offset-md-2">
              <div>
                <DimensionsProvider>
                  {(width) => (
                    <Piano
                      startNote="c4"
                      endNote="c6"
                      notes={
                        this.state.isPlaying
                          ? this.state.notesArray[this.state.notesArrayIndex]
                          : null
                      }
                      onNoteDown={this.onNoteDown}
                      onNoteUp={this.onNoteUp}
                      disabled={!this.state.instrument}
                      keyboardConfig={KEYBOARD_CONFIGS.MIDDLE}
                      width={width}
                      renderNoteLabel={renderNoteLabel}
                      onRecordNotes={this.onRecordNotes}
                    />
                  )}
                </DimensionsProvider>
              </div>
              <Composer
                className="mt-3"
                isPlaying={this.state.isPlaying}
                notesArray={this.state.notesArray}
                notesArrayIndex={this.state.notesArrayIndex}
                onClear={() => {
                  this.onStop();
                  this.setState({
                    notesArray: [],
                    notesArrayIndex: 0,
                  });
                }}
                onPlay={(notesArray) => {
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
                      notesArrayIndex: this.getShiftedNotesArrayIndex(
                        1,
                        this.state.notesArray.length,
                      ),
                    });
                  }, 250);
                }}
                onStop={this.onStop}
              />
            </div>
          </div>
          <hr className="mt-5" />
          <div className="row mt-5">
            <div className="col">
              <div className="text-center">
                <h2>Installation</h2>
                <p className="mt-4">Install with yarn or npm:</p>
                <p className="mt-3">
                  <code className="p-2 text-dark bg-yellow">yarn add react-piano</code>
                </p>
                <div className="mt-5">
                  <a className="btn btn-info btn-lg" href="https://github.com/iqnivek/react-piano">
                    View docs on Github
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
