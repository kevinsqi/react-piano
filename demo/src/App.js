import React, { Component } from 'react';
import Piano from 'react-piano';
import Oscillator from './Oscillator';
import PianoContainer from './PianoContainer';
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

class App extends Component {
  oscillator = new Oscillator({
    audioContext,
    gain: 0.1,
  });

  onNoteDown = ({ frequency }) => {
    audioContext.resume().then(() => {
      this.oscillator.start(frequency);
    });
  };

  onNoteUp = ({ frequency }) => {
    audioContext.resume().then(() => {
      this.oscillator.stop(frequency);
    });
  };

  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-8 offset-md-2">
              <PianoContainer>
                {(width) => (
                  <Piano
                    startNote="c4"
                    endNote="c6"
                    onNoteDown={this.onNoteDown}
                    onNoteUp={this.onNoteUp}
                    keyboardConfig={KEYBOARD_CONFIG.MIDDLE}
                    width={width}
                    renderNoteLabel={({ isBlack, keyboardShortcut }) => {
                      if (!keyboardShortcut) {
                        return null;
                      }
                      return (
                        <div className="text-center">
                          {isBlack ? (
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
                    }}
                  />
                )}
              </PianoContainer>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4 offset-md-4">
              <PianoContainer>
                {(width) => (
                  <Piano
                    startNote="c3"
                    endNote="c4"
                    onNoteDown={this.onNoteDown}
                    onNoteUp={this.onNoteUp}
                    width={width}
                  />
                )}
              </PianoContainer>
            </div>
          </div>
          <hr className="mt-5" />
          <div className="row mt-5">
            <div className="col">
              <div className="text-center">
                <h2>Installation</h2>
                <p>Install with yarn or npm:</p>
                <p className="mt-4">
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
