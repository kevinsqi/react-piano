import React from 'react';

class InputManager extends React.Component {
  handleMouseDown = (event) => {
    this.props.onMouseDown(event);
  };

  handleMouseUp = (event) => {
    this.props.onMouseUp(event);
  };

  componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    return null;
  }
}

export default InputManager;
