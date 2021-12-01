import '@babel/polyfill';

import React from 'react';
import { render } from 'react-dom';
import App from './App';

//import registerServiceWorker from './registerServiceWorker';

render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

//registerServiceWorker();
