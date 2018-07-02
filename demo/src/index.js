import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// noreintegrate
// import App from './App';
import App from './composer/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
