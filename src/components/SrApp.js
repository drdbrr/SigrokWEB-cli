import React, { useCallback, useState } from 'react';
import { ScSrApp } from '../styled/ScSrApp';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, redTheme } from "../styled/Themes"
import { SrDecoderMenu } from './SrDecoderMenu';
import { SrTabularMenu } from './SrTabularMenu';
import { SrCanvas } from './SrCanvas';
import { SrMenuPanel } from './SrMenuPanel';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-size:14px;
    }
`;

export const SrApp = ({ws, session}) =>{
    console.log('Render SrApp');
    const [ decoderMenu, setDecoderMenul ] = useState(false);
    const [ tabularMenu, setTabularMenu ] = useState(false);
    
    //ATTENTION https://stackoverflow.com/questions/54847286/member-functions-with-react-hooks
    const toggleDecoderMenu = useCallback(() =>{
        setTabularMenu(false);
        setDecoderMenul(decoderMenu => !decoderMenu)
    }, []);
    
    const toggleTabularMenu = useCallback(() =>{
        setDecoderMenul(false);
        setTabularMenu(tabularMenu => !tabularMenu)
    }, []);

    return(
        <ThemeProvider theme={blueTheme}>
            <GlobalStyle />
            <ScSrApp>
                <SrMenuPanel
                    toggleDecoderMenu={toggleDecoderMenu}
                    toggleTabularMenu={toggleTabularMenu}
                    session={session}
                    ws={ws}
                />
                <SrCanvas ws={ws}/>
                { (decoderMenu) ? <SrDecoderMenu /> : null }
                { (tabularMenu) ? <SrTabularMenu /> : null }
            </ScSrApp>
        </ThemeProvider>
    )
}
