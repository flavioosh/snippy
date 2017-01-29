import Config from 'electron-config';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/app';


const config = new Config();

const useSystemTitleBar = config.get('useSystemTitleBar') || false

ReactDOM.render(
    <App useSystemTitleBar={useSystemTitleBar} />,
    document.getElementById('root')
);
