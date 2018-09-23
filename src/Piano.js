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

  componentDidUpdate(prevProps) {
    // Make activeNotes "controllable" by using internal
    // state by default, but allowing prop overrides.
    if (
      prevProps.activeNotes !== this.props.activeNotes &&
      this.state.activeNotes !== this.props.activeNotes
    ) {
      this.setState({
        activeNotes: this.props.activeNotes,
      });
    }
  }

  handlePlayNoteInput = (midiNumber) => {
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.concat(midiNumber),
    }));
  };

  handleStopNoteInput = (midiNumber) => {
    this.setState((prevState) => ({
      activeNotes: prevState.activeNotes.filter((note) => midiNumber !== note),
    }));
  };

  render() {
    return (
      <ControlledPiano
        activeNotes={this.state.activeNotes}
        onPlayNoteInput={this.handlePlayNoteInput}
        onStopNoteInput={this.handleStopNoteInput}
        {...this.props}
      />
    );
  }
}

export default Piano;
