import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";
import Oscillator from "./Oscillator";

const KEYBOARD_CONFIG = [
  { natural: "a", flat: "q", sharp: "w" },
  { natural: "s", flat: "w", sharp: "e" },
  { natural: "d", flat: "e", sharp: "r" },
  { natural: "f", flat: "r", sharp: "t" },
  { natural: "g", flat: "t", sharp: "y" },
  { natural: "h", flat: "y", sharp: "u" },
  { natural: "j", flat: "u", sharp: "i" },
  { natural: "k", flat: "i", sharp: "o" },
  { natural: "l", flat: "o", sharp: "p" },
  { natural: ";", flat: "p", sharp: "[" },
  { natural: "'", flat: "[", sharp: "]" }
];

const audioContext = new window.AudioContext();
class App extends Component {
  oscillator = new Oscillator({
    audioContext,
    gain: 0.1
  });

  // noreintegrate make oscillator take midi notes
  onKeyDown = ({ frequency }) => {
    audioContext.resume().then(() => {
      this.oscillator.start(frequency);
    });
  };
  onKeyUp = ({ frequency }) => {
    audioContext.resume().then(() => {
      this.oscillator.stop(frequency);
    });
  };
  render() {
    return (
      <div>
        <div style={{ width: "800px", height: "300px" }}>
          <Piano
            startNote="c4"
            endNote="c6"
            onKeyUp={this.onKeyUp}
            onKeyDown={this.onKeyDown}
            keyboardConfig={KEYBOARD_CONFIG}
          />
        </div>
        <div style={{ width: "100%", height: "300px" }}>
          <Piano
            startNote="a3"
            endNote="f7"
            onKeyUp={this.onKeyUp}
            onKeyDown={this.onKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default App;
