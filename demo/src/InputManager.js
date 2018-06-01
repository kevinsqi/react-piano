import React from 'react';

class InputManager extends React.Component {
  handleKeyDown = (event) => {
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  };

  handleKeyUp = (event) => {
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event);
    }
  };

  handleMouseDown = (event) => {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(event);
    }
  };

  handleMouseUp = (event) => {
    if (this.props.onMouseUp) {
      this.props.onMouseUp(event);
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  render() {
    return null;
  }
}

export default InputManager;
