import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";

class App extends Component {
  render() {
    return (
      <div>
        <div style={{ width: "800px", height: "300px" }}>
          <Piano startNote="c4" endNote="c6" />
        </div>
        <div style={{ width: "100%", height: "300px" }}>
          <Piano startNote="a3" endNote="f7" />
        </div>
      </div>
    );
  }
}

export default App;
