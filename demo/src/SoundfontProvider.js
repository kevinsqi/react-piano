import React from 'react';
import Soundfont from 'soundfont-player';

class SoundfontProvider extends React.Component {
  static defaultProps = {
    format: 'mp3',
    soundfont: 'MusyngKite',
    instrumentName: 'acoustic_grand_piano',
  };

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
      instrumentList: [props.instrumentName],
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
    this.loadInstrumentList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      // Re-trigger loading state
      this.setState({
        instrument: null,
      });
      this.loadInstrument(this.props.instrumentName);
    }
  }

  loadInstrument = (instrumentName) => {
    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      soundfont: this.props.soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${this.props.hostname}/${soundfont}/${name}-${format}.js`;
      },
    }).then((instrument) => {
      this.setState({
        instrument,
      });
    });
  };

  loadInstrumentList = () => {
    fetch(`${this.props.hostname}/${this.props.soundfont}/names.json`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          instrumentList: data,
        });
      });
  };

  startNote = (midiNumber) => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  stopNote = (midiNumber) => {
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

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
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
      isLoading: !(this.state.instrument && this.state.instrumentList),
      startNote: this.startNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
      instrumentList: this.state.instrumentList,
    });
  }
}

export default SoundfontProvider;
