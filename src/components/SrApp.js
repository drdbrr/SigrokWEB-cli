import React, { useCallback, useState } from 'react';
import { ScSrApp } from '../styled/ScSrApp';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, redTheme } from "../styled/Themes"
//import { SrDecoderMenu } from './SrDecoderMenu';
//import { SrTabularMenu } from './SrTabularMenu';
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

export const SrApp = ({ws, btnRef, session}) =>{
    console.log('Render SrApp');
    /*
    const [ decoderMenu, setDecoderMenu ] = useState(false);
    const [ tabularMenu, setTabularMenu ] = useState(false);
    
    //ATTENTION https://stackoverflow.com/questions/54847286/member-functions-with-react-hooks
    const toggleDecoderMenu = useCallback(() =>{
        setTabularMenu(false);
        setDecoderMenu(decoderMenu => !decoderMenu)
    }, []);
    
    const toggleTabularMenu = useCallback(() =>{
        setDecoderMenu(false);
        setTabularMenu(tabularMenu => !tabularMenu)
    }, []);
    */

    return(
        <ThemeProvider theme={blueTheme}>
            <GlobalStyle />
            <ScSrApp>
                <SrMenuPanel
                    session={session}
                    ws={ws}
                    btnRef={btnRef}
                />
                <SrCanvas ws={ws}/>
                {/* (decoderMenu) ? <SrDecoderMenu /> : null */}
                {/* (tabularMenu) ? <SrTabularMenu /> : null */}
            </ScSrApp>
        </ThemeProvider>
    )
}
