import React from 'react';

class Key extends React.Component {
  state = {
    touchEvent: false,
  };

  onTouchStart = (event) => {
    this.setState({
      touchEvent: true,
    });
    this.props.onNoteDown();
  };

  onMouseDown = (event) => {
    if (this.state.touchEvent) {
      return;
    }
    this.props.onNoteDown();
  };

  render() {
    return (
      <div
        className={this.props.className}
        style={{
          position: 'absolute',
          top: 0,
          left: this.props.left,
          width: this.props.width,
          height: this.props.height,
          display: 'flex',
        }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.props.onNoteUp}
        onMouseEnter={this.props.gliss ? this.props.onNoteDown : null}
        onMouseLeave={this.props.gliss ? this.props.onNoteUp : null}
        onTouchStart={this.onTouchStart}
        onTouchCancel={this.props.onNoteUp}
        onTouchEnd={this.props.onNoteUp}
      >
        <div style={{ alignSelf: 'flex-end', flex: 1 }}>{this.props.children}</div>
      </div>
    );
  }
}

export default Key;
