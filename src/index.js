import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import './assets/css/selectcustom.css';
// import './config/selectcustom.js';
import './index.css';
import { AppProvider, Frame } from '@shopify/polaris';
import App from './App';
import {
    BrowserRouter as Router,
} from "react-router-dom";

ReactDOM.render(<Router basename="/test-discount"><AppProvider><div className={'orichi-root'}><Frame><div className={'orichi-main'}><App /></div></Frame></div></AppProvider></Router>, document.getElementById('root'));

