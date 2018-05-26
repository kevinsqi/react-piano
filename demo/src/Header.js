import React from 'react';

function Header() {
  return (
    <div style={{ background: '#333' }}>
      <div className="container">
        <div className="text-center text-white p-5">
          <h1>react-piano</h1>
          <p>A responsive, configurable, programmable piano keyboard for React</p>
          <div className="mt-4">
            <a
              className="btn btn-outline-light btn-lg"
              href="https://github.com/iqnivek/react-piano"
            >
              View docs on Github
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
