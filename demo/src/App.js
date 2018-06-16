import React from 'react';
import MdArrowDownward from 'react-icons/lib/md/arrow-downward';
import 'react-piano/build/styles.css';

import Header from './Header';
import Footer from './Footer';
import InstrumentProvider from './InstrumentProvider';
import PianoComposer from './PianoComposer';
import './App.css';

function Installation() {
  return (
    <div className="text-center">
      <h2>Installation</h2>
      <p className="mt-4">Install with yarn or npm:</p>
      <p className="mt-3">
        <code className="p-2 text-dark bg-yellow">yarn add react-piano</code>
      </p>
      <div className="mt-5">
        <a className="btn btn-info btn-lg" href="https://github.com/iqnivek/react-piano">
          View docs on Github
        </a>
      </div>
    </div>
  );
}

const audioContext = new window.AudioContext();

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="text-center mt-5">
            <p className="">Try it by clicking, tapping, or using your keyboard</p>
            <div style={{ color: '#777' }}>
              <MdArrowDownward size={32} />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-8 offset-md-2">
              <InstrumentProvider audioContext={audioContext}>
                {({ isLoading, onNoteStart, onNoteUp, onStopAll }) => (
                  <PianoComposer
                    startNote={55}
                    endNote={79}
                    audioContext={audioContext}
                    onNoteStart={onNoteStart}
                    onNoteUp={onNoteUp}
                    onStopAll={onStopAll}
                    isLoading={isLoading}
                  />
                )}
              </InstrumentProvider>
            </div>
          </div>
          <hr className="mt-5" />
          <div className="row mt-5">
            <div className="col">
              <Installation />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
