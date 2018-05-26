import React from 'react';
import classNames from 'classnames';
import { getMidiNumberAttributes } from 'react-piano';

class Composer extends React.Component {
  export = () => {
    const stepDuration = 1 / 4;
    const serialization = this.props.notesArray.map((midiNumbers, index) => {
      return {
        time: index * stepDuration,
        notes: midiNumbers,
        duration: stepDuration,
      };
    });
    console.log(JSON.stringify(serialization, null, 4));
  };

  play = () => {
    if (this.props.notesArray) {
      this.props.onPlay(this.props.notesArray);
    }
  };

  isPlayable = () => {
    return this.props.notesArray.length > 0 && !this.props.isPlaying;
  };

  render() {
    return (
      <div className={this.props.className}>
        <div>
          <div className="btn-group">
            <button
              className="btn btn-info btn-sm"
              disabled={!this.isPlayable()}
              onClick={this.play}
            >
              Play
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={!this.props.isPlaying}
              onClick={this.props.onStop}
            >
              Stop
            </button>
          </div>
          <span className="ml-1">
            <button
              className="btn btn-outline-danger btn-sm"
              disabled={this.props.notesArray.length === 0}
              onClick={this.props.onClear}
            >
              Clear
            </button>
          </span>
          <span className="ml-1">
            <button className="btn btn-outline-secondary btn-sm" onClick={this.export}>
              Export
            </button>
          </span>
        </div>
        <div className="mt-3">
          {this.props.notesArray.map((notes, index) => {
            const label =
              notes.length > 0
                ? notes.map((note) => getMidiNumberAttributes(note).note.toUpperCase()).join(' ')
                : '_';
            return (
              <span
                className={classNames('Notes mr-1', {
                  'Notes--active': index === this.props.notesArrayIndex,
                })}
                key={[index, label]}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Composer;
