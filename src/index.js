import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { Client } from './ApolloClient';
import { Helmet } from 'react-helmet';
import { App } from './containers/App';
import packageJson from '../package.json';
import { Favicon } from './styled/Favicon';

//import registerServiceWorker from './registerServiceWorker';

render(
    <ApolloProvider client={Client}>
        <Helmet>
            <meta charSet="utf-8" />
            <title>{packageJson.name.split('-')[0] + ' ' + packageJson.version}</title>
            <link rel="canonical" href="https://sigrok.org" />
            <link rel="icon" type="image/png" href={"data:image/png;base64," + Favicon} sizes="16x16" />
        </Helmet>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

//registerServiceWorker();
