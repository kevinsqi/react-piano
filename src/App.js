import React, { Component } from "react";
import "./App.css";
import Piano from "./Piano";

class App extends Component {
  render() {
    return (
      <div style={{ width: "500px" }}>
        <Piano width={300} height={200} />
      </div>
    );
  }
}

export default App;
