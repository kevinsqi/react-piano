import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import difference from 'lodash.difference';
import ControlledPiano from './ControlledPiano';
import Keyboard from './Keyboard';

class Piano extends React.Component {
  static propTypes = {
    noteRange: PropTypes.object.isRequired,
    activeNotes: PropTypes.arrayOf(PropTypes.number.isRequired),
    playNote: PropTypes.func.isRequired,
    stopNote: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    keyWidthToHeight: PropTypes.number,
    keyboardShortcuts: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        midiNumber: PropTypes.number.isRequired,
      }),
    ),
  };

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
    const { activeNotes, ...otherProps } = this.props;
    return (
      <ControlledPiano
        activeNotes={this.state.activeNotes}
        onPlayNoteInput={this.handlePlayNoteInput}
        onStopNoteInput={this.handleStopNoteInput}
        {...otherProps}
      />
    );
  }
}

export default Piano;
