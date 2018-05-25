import React from 'react';
import classNames from 'classnames';
import { Piano, getMidiNumberAttributes } from 'react-piano';
import 'react-piano/build/styles.css';
import Soundfont from 'soundfont-player';
import Oscillator from './Oscillator';
import DimensionsProvider from './DimensionsProvider';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import './App.css';

// TODO: move this to be exported from Piano.js (index.js)
const KEYBOARD_CONFIG = {
  BOTTOM: [
    { natural: 'z', flat: 'a', sharp: 's' },
    { natural: 'x', flat: 's', sharp: 'd' },
    { natural: 'c', flat: 'd', sharp: 'f' },
    { natural: 'v', flat: 'f', sharp: 'g' },
    { natural: 'b', flat: 'g', sharp: 'h' },
    { natural: 'n', flat: 'h', sharp: 'j' },
    { natural: 'm', flat: 'j', sharp: 'k' },
    { natural: ',', flat: 'k', sharp: 'l' },
    { natural: '.', flat: 'l', sharp: ';' },
    { natural: '/', flat: ';', sharp: "'" },
  ],
  MIDDLE: [
    { natural: 'a', flat: 'q', sharp: 'w' },
    { natural: 's', flat: 'w', sharp: 'e' },
    { natural: 'd', flat: 'e', sharp: 'r' },
    { natural: 'f', flat: 'r', sharp: 't' },
    { natural: 'g', flat: 't', sharp: 'y' },
    { natural: 'h', flat: 'y', sharp: 'u' },
    { natural: 'j', flat: 'u', sharp: 'i' },
    { natural: 'k', flat: 'i', sharp: 'o' },
    { natural: 'l', flat: 'o', sharp: 'p' },
    { natural: ';', flat: 'p', sharp: '[' },
    { natural: "'", flat: '[', sharp: ']' },
  ],
  TOP: [
    { natural: 'q', flat: '1', sharp: '2' },
    { natural: 'w', flat: '2', sharp: '3' },
    { natural: 'e', flat: '3', sharp: '4' },
    { natural: 'r', flat: '4', sharp: '5' },
    { natural: 't', flat: '5', sharp: '6' },
    { natural: 'y', flat: '6', sharp: '7' },
    { natural: 'u', flat: '7', sharp: '8' },
    { natural: 'i', flat: '8', sharp: '9' },
    { natural: 'o', flat: '9', sharp: '0' },
    { natural: 'p', flat: '0', sharp: '-' },
    { natural: '[', flat: '-', sharp: '=' },
  ],
};

const audioContext = new window.AudioContext();

// TODO: css class
const themeColor = '#f8e8d5';

function GithubLink() {
  return (
    <a className="btn btn-info btn-lg" href="https://github.com/iqnivek/react-piano">
      View docs on Github
    </a>
  );
}

function Footer(props) {
  return (
    <div className="mt-5 py-5" style={{ backgroundColor: themeColor }}>
      <div className="container">
        <div className="text-center text-secondary">
          Made with{' '}
          <span role="img" aria-label="keyboard emoji">
            🎹
          </span>
          by{' '}
          <a className="text-secondary" href="http://www.kevinqi.com/">
            <strong>@iqnivek</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div style={{ background: '#333' }}>
      <div className="container">
        <div className="text-center text-white p-5">
          <h1>react-piano</h1>
          <p>A responsive, configurable, programmable piano keyboard for React</p>
          <div className="mt-4">
            <a
              className="btn btn-outline-light btn-lg"
              href="https://github.com/iqnivek/react-piano"
            >
              View docs on Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderNoteLabel({ isAccidental }, { keyboardShortcut }) {
  if (!keyboardShortcut) {
    return null;
  }
  return (
    <div className="text-center">
      {isAccidental ? (
        <div
          style={{
            color: themeColor,
            fontSize: '12px',
            textTransform: 'capitalize',
            marginBottom: 3,
          }}
        >
          {keyboardShortcut}
        </div>
      ) : (
        <div
          style={{
            color: themeColor,
            backgroundColor: '#aaa',
            padding: '4px 0',
            margin: 3,
            border: '1px solid #fff',
            borderRadius: 4,
            fontSize: '12px',
            textTransform: 'capitalize',
          }}
        >
          {keyboardShortcut}
        </div>
      )}
    </div>
  );
}

class Composition extends React.Component {
  export = () => {
    const stepDuration = 1 / 4;
    const serialization = this.props.notesArray.map((midiNumbers, index) => {
      return {
        time: index * stepDuration,
        notes: midiNumbers,
        duration: stepDuration,
      };
    });
    console.log(JSON.stringify(serialization, null, 4));
  };

  play = () => {
    if (this.props.notesArray) {
      this.props.onPlay(this.props.notesArray);
    }
  };

  isPlayable = () => {
    return this.props.notesArray.length > 0 && !this.props.isPlaying;
  };

  render() {
    return (
      <div className={this.props.className}>
        <div>
          <div className="btn-group">
            <button
              className="btn btn-info btn-sm"
              disabled={!this.isPlayable()}
              onClick={this.play}
            >
              Play
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={!this.props.isPlaying}
              onClick={this.props.onStop}
            >
              Stop
            </button>
          </div>
          <span className="ml-1">
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={this.props.notesArray.length === 0}
              onClick={this.props.onClear}
            >
              Clear
            </button>
          </span>
          <span className="ml-1">
            <button className="btn btn-outline-secondary btn-sm" onClick={this.export}>
              Export
            </button>
          </span>
        </div>
        <div className="mt-2">
          {this.props.notesArray.map((notes, index) => {
            const label =
              notes.length > 0
                ? notes.map((note) => getMidiNumberAttributes(note).note.toUpperCase()).join(' ')
                : '&nbsp;';
            return (
              <span
                className={classNames('Notes mr-1', {
                  'Notes--active': index === this.props.notesArrayIndex,
                })}
                key={[index, label]}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
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
    // Sound names here: http://gleitz.github.io/midi-js-soundfonts/MusyngKite/names.json
    Soundfont.instrument(audioContext, 'acoustic_grand_piano').then((instrument) => {
      this.setState({
        instrument,
      });
    });
  }

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

  onStop = () => {
    clearInterval(this.playbackIntervalHandler);
    this.setState({
      isPlaying: false,
      isRecording: true,
      notesArrayIndex: 0,
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
                      keyboardConfig={KEYBOARD_CONFIG.MIDDLE}
                      width={width}
                      renderNoteLabel={renderNoteLabel}
                      onRecordNotes={(midiNumbers) => {
                        if (this.state.isRecording) {
                          this.setState({
                            notesArray: this.state.notesArray.concat([midiNumbers]),
                          });
                        }
                      }}
                    />
                  )}
                </DimensionsProvider>
              </div>
              <Composition
                className="mt-3"
                isPlaying={this.state.isPlaying}
                notesArray={this.state.notesArray}
                notesArrayIndex={this.state.notesArrayIndex}
                onClear={() => {
                  this.onStop();
                  this.setState({
                    notesArray: [],
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
                      notesArrayIndex: (this.state.notesArrayIndex + 1) % notesArray.length,
                    });
                  }, 250);
                }}
                onStop={this.onStop}
              />
            </div>
          </div>
          <div className="row mt-5">
            <div className="col">
              <div className="text-center">
                <h2>Installation</h2>
                <p className="mt-4">Install with yarn or npm:</p>
                <p className="mt-3">
                  <code className="p-2 text-dark" style={{ backgroundColor: themeColor }}>
                    yarn add react-piano
                  </code>
                </p>
                <div className="mt-5">
                  <GithubLink />
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
