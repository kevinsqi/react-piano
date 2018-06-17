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
              <InstrumentProvider
                audioContext={audioContext}
                hostname="http://d1pzp51pvbm36p.cloudfront.net"
              >
                {({
                  isLoading,
                  instrumentList,
                  instrumentName,
                  onChangeInstrument,
                  onNoteStart,
                  onNoteStop,
                  onStopAll,
                }) => (
                  <div>
                    <div className="text-center">
                      <select
                        className="form-control d-inline-block"
                        style={{ width: 200 }}
                        value={instrumentName}
                        onChange={(event) => onChangeInstrument(event.target.value)}
                      >
                        {instrumentList.map((value) => (
                          <option value={value} key={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-3">
                      <PianoComposer
                        startNote={55}
                        endNote={79}
                        audioContext={audioContext}
                        onNoteStart={onNoteStart}
                        onNoteStop={onNoteStop}
                        onStopAll={onStopAll}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
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
