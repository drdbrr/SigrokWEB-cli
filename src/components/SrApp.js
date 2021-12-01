import React from 'react';
import { ScSrApp } from '../styled/ScSrApp';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, redTheme } from "../styled/Themes"
import { SrCanvas } from './SrCanvas';
import { SrMenuPanel } from './SrMenuPanel';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-size:14px;
        scrollbar-width: 10px;
        scrollbar-color: #90A4AE #CFD8DC;
    }
`;

export const SrApp = ({ws, session}) =>{
    console.log('Render SrApp');
    return(
        <ThemeProvider theme={blueTheme}>
            <GlobalStyle />
            <ScSrApp>
                <SrMenuPanel
                    session={session}
                    ws={ws}
                />
                <SrCanvas ws={ws}/>
            </ScSrApp>
        </ThemeProvider>
    )
}
