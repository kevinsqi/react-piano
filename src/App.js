import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";
import Oscillator from "./Oscillator";

const audioContext = new window.AudioContext();
class App extends Component {
  oscillator = new Oscillator({
    audioContext,
    gain: 0.1
  });

  // noreintegrate rename all these handlers to onKeyUp etc
  // noreintegrate make oscillator take midi notes
  handleKeyDown = ({ frequency }) => {
    audioContext.resume().then(() => {
      this.oscillator.start(frequency);
    });
  };
  handleKeyUp = ({ frequency }) => {
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
            keyUp={this.handleKeyUp}
            keyDown={this.handleKeyDown}
          />
        </div>
        <div style={{ width: "100%", height: "300px" }}>
          <Piano
            startNote="a3"
            endNote="f7"
            keyUp={this.handleKeyUp}
            keyDown={this.handleKeyDown}
          />
        </div>
      </div>
    );
  }
}

export default App;
