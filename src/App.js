import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";

class App extends Component {
  render() {
    return (
      <div style={{ width: "500px", height: "300px" }}>
        <Piano startNote="c4" endNote="c6" />
      </div>
    );
  }
}

export default App;
