import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import ControlledPiano from './ControlledPiano';
import Keyboard from './Keyboard';

class Piano extends React.Component {
  state = {
    activeNotes: [],
  };

  handlePlayNote = (midiNumber) => {
    this.props.onPlayNote(midiNumber);
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.concat(midiNumber),
    }));
  };

  handleStopNote = (midiNumber) => {
    this.props.onStopNote(midiNumber);
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
    }));
  };

  render() {
    const { onPlayNote, onStopNote, ...otherProps } = this.props;
    return (
      <ControlledPiano
        activeNotes={this.state.activeNotes}
        onPlayNote={this.handlePlayNote}
        onStopNote={this.handleStopNote}
        {...otherProps}
      />
    );
  }
}

export default Piano;
