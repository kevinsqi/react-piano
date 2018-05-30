import React from 'react';
import Soundfont from 'soundfont-player';

class InstrumentProvider extends React.Component {
  state = {
    activeAudioNodes: {},
    instrument: null,
  };

  componentDidMount() {
    this.loadInstrument();
  }

  loadInstrument = () => {
    // Sound names here: http://gleitz.github.io/midi-js-soundfonts/MusyngKite/names.json
    Soundfont.instrument(this.props.audioContext, 'acoustic_grand_piano', {
      nameToUrl: (name, soundfont, format) => {
        return `${window.location.pathname}soundfonts/${name}-mp3.js`;
      },
    }).then((instrument) => {
      this.setState({
        instrument,
      });
    });
  };

  onNoteDown = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  onNoteUp = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      // TODO: refactor
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      const activeAudioNodes = Object.assign({}, this.state.activeAudioNodes);
      delete activeAudioNodes[midiNumber];
      this.setState({
        activeAudioNodes,
      });
    });
  };

  render() {
    return this.props.children({
      isLoading: !!this.state.instrument,
      onNoteDown: this.onNoteDown,
      onNoteUp: this.onNoteUp,
    });
  }
}

export default InstrumentProvider;
