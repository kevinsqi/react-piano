import React from 'react';
import classNames from 'classnames';
import { getMidiNumberAttributes } from 'react-piano';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import MdArrowForward from 'react-icons/lib/md/arrow-forward';

function NotesArray(props) {
  return (
    <div className={props.className}>
      {props.notesArray.map((notes, index) => {
        const label =
          notes.length > 0
            ? notes.map((note, index) => {
                const { basenote, octave } = getMidiNumberAttributes(note);
                return (
                  <span key={[index, note]}>
                    <span>{`${basenote.charAt(0).toUpperCase()}${basenote.slice(1)}`}</span>
                    <span className="Note--subscript">{octave}</span>
                  </span>
                );
              })
            : '_';
        return (
          <span
            className={classNames('Notes mr-1 mb-1', {
              'Notes--active': index === props.notesArrayIndex,
            })}
            key={index}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}

class Composer extends React.Component {
  export = () => {
    /*
    const stepDuration = 1 / 4;
    const serialization = this.props.notesArray.map((midiNumbers, index) => {
      return {
        time: index * stepDuration,
        notes: midiNumbers,
        duration: stepDuration,
      };
    });
    console.log(JSON.stringify(serialization, null, 4));
    */
    const exportJSON = JSON.stringify({
      notes: this.props.notesArray,
    });
    console.log(exportJSON);
    alert('Composition exported to developer console');
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
    const hasNotes = this.props.notesArray.length > 0;
    return (
      <div className={this.props.className}>
        <div className="d-flex flex-row">
          <div style={{ flex: 1 }}>
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
            <span className="ml-3">
              <button
                className="btn btn-outline-danger btn-sm"
                disabled={!hasNotes}
                onClick={this.props.onClear}
              >
                Clear all
              </button>
            </span>
          </div>
          <div>
            <button
              className="btn btn-outline-secondary btn-sm"
              disabled={!hasNotes}
              onClick={this.export}
            >
              Export
            </button>
          </div>
        </div>
        <div className="d-flex flex-row mt-3">
          <div className="btn-group" style={{ flex: 1 }}>
            <button
              className="btn btn-outline-secondary btn-sm text-left"
              disabled={!hasNotes}
              onClick={this.props.onStepBackward}
            >
              Step back{' '}
              <span className="KeyboardShortcutLabel">
                <MdArrowBack />
              </span>
            </button>
            <button
              className="btn btn-outline-secondary btn-sm text-left"
              disabled={!hasNotes}
              onClick={this.props.onStepForward}
            >
              Step forward
              <span className="KeyboardShortcutLabel">
                <MdArrowForward />
              </span>
            </button>
          </div>

          <div className="btn-group ml-3">
            <button
              className="btn btn-outline-secondary btn-sm text-left"
              onClick={this.props.onAddRest}
            >
              Add rest <span className="KeyboardShortcutLabel">Dash (-)</span>
            </button>
            <button
              className="btn btn-outline-danger btn-sm text-left"
              disabled={!hasNotes}
              onClick={this.props.onDeleteNote}
            >
              Delete note <span className="KeyboardShortcutLabel">Backspace</span>
            </button>
          </div>
        </div>
        {hasNotes ? (
          <NotesArray
            className="mt-3"
            notesArray={this.props.notesArray}
            notesArrayIndex={this.props.notesArrayIndex}
          />
        ) : null}
      </div>
    );
  }
}

export default Composer;
