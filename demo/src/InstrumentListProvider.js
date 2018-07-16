import React from 'react';
import PropTypes from 'prop-types';

class InstrumentListProvider extends React.Component {
  static propTypes = {
    hostname: PropTypes.string.isRequired,
    soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
    render: PropTypes.func,
  };

  static defaultProps = {
    soundfont: 'MusyngKite',
  };

  state = {
    instrumentList: null,
  };

  componentDidMount() {
    this.loadInstrumentList();
  }

  loadInstrumentList = () => {
    fetch(`${this.props.hostname}/${this.props.soundfont}/names.json`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          instrumentList: data,
        });
      });
  };

  render() {
    return this.props.render(this.state.instrumentList);
  }
}

export default InstrumentListProvider;
