import React from 'react';
import PropTypes from 'prop-types';

const AspectRatioWrapper = (props) => {
  if (props.widthToHeightRatio) {
    return (
      <div
        style={{
          position: 'relative',
          height: 0,
          paddingTop: `${(1 / props.widthToHeightRatio) * 100}%`,
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {props.children}
        </div>
      </div>
    );
  } else {
    return props.children;
  }
};

AspectRatioWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  widthToHeightRatio: PropTypes.number,
};

export default AspectRatioWrapper;
