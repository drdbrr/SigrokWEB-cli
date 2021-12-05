import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Client /*, sidVar*/ } from './ApolloClient';
import { Helmet } from 'react-helmet';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { defaultTheme } from "./styled/Themes";
import { Favicon } from "./styled/Favicon";
import MainViewLayout from './layouts/MainViewLayout';
import WsProvider from './containers/WsContext';

import packageJson from '../package.json';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-size:14px;
        scrollbar-width: 10px;
        scrollbar-color: #90A4AE #CFD8DC;
    }
`;

const App = () =>{
    return(
        <ThemeProvider theme={defaultTheme}>
            <ApolloProvider client={Client}>
                <WsProvider >
            
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>{packageJson.name.split('-')[0] + ' ' + packageJson.version}</title>
                        <link rel="canonical" href="https://sigrok.org" />
                        <link rel="icon" type="image/x-icon" href={Favicon} sizes="16x16" />
                    </Helmet>
                
                    <GlobalStyle />
                    
                    <MainViewLayout />
                    
                </WsProvider>
            </ApolloProvider>
        </ThemeProvider>
    );
}

export default App;
