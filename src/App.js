import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";
import Oscillator from "./Oscillator";

const CONFIG_BOTTOM_ROW = [
  { natural: "z", flat: "a", sharp: "s" },
  { natural: "x", flat: "s", sharp: "d" },
  { natural: "c", flat: "d", sharp: "f" },
  { natural: "v", flat: "f", sharp: "g" },
  { natural: "b", flat: "g", sharp: "h" },
  { natural: "n", flat: "h", sharp: "j" },
  { natural: "m", flat: "j", sharp: "k" },
  { natural: ",", flat: "k", sharp: "l" },
  { natural: ".", flat: "l", sharp: ";" },
  { natural: "/", flat: ";", sharp: "'" }
];

const CONFIG_MIDDLE_ROW = [
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

const CONFIG_TOP_ROW = [
  { natural: "q", flat: "1", sharp: "2" },
  { natural: "w", flat: "2", sharp: "3" },
  { natural: "e", flat: "3", sharp: "4" },
  { natural: "r", flat: "4", sharp: "5" },
  { natural: "t", flat: "5", sharp: "6" },
  { natural: "y", flat: "6", sharp: "7" },
  { natural: "u", flat: "7", sharp: "8" },
  { natural: "i", flat: "8", sharp: "9" },
  { natural: "o", flat: "9", sharp: "0" },
  { natural: "p", flat: "0", sharp: "-" },
  { natural: "[", flat: "-", sharp: "=" }
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
            keyboardConfig={CONFIG_TOP_ROW}
          />
        </div>
        <div style={{ width: "100%", height: "300px" }}>
          <Piano
            startNote="a3"
            endNote="f7"
            onKeyUp={this.onKeyUp}
            onKeyDown={this.onKeyDown}
            keyboardConfig={CONFIG_BOTTOM_ROW}
          />
        </div>
      </div>
    );
  }
}

export default App;
