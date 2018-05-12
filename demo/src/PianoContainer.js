import React from 'react';
import Dimensions from 'react-dimensions';

class PianoContainer extends React.Component {
  render() {
    return <div>{this.props.children(this.props.containerWidth)}</div>;
  }
}

export default Dimensions()(PianoContainer);
