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

  onNoteStart = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  onNoteStop = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = this.state.activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, { [midiNumber]: null }),
      });
    });
  };

  // Clear any residual notes that don't get called with onNoteStop
  onStopAll = () => {
    this.props.audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(this.state.activeAudioNodes);
      activeAudioNodes.forEach((node) => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {},
      });
    });
  };

  render() {
    return this.props.children({
      isLoading: !this.state.instrument,
      onNoteStart: this.onNoteStart,
      onNoteStop: this.onNoteStop,
      onStopAll: this.onStopAll,
    });
  }
}

export default InstrumentProvider;
