import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";

class App extends Component {
  render() {
    return (
      <div style={{ width: "500px", height: "300px" }}>
        <Piano />
      </div>
    );
  }
}

export default App;
