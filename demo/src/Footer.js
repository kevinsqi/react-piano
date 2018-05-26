import React from 'react';

function Footer(props) {
  return (
    <div className="bg-yellow mt-5 py-5">
      <div className="container">
        <div className="text-center text-secondary">
          Made with{' '}
          <span role="img" aria-label="keyboard emoji">
            🎹
          </span>
          by{' '}
          <a className="text-secondary" href="http://www.kevinqi.com/">
            <strong>@iqnivek</strong>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
