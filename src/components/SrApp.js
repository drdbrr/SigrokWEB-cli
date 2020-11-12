import React, { useCallback, useState, memo, useRef } from 'react';
import { ScSrApp } from '../styled/ScSrApp';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, redTheme } from "../styled/Themes"
import { MenuPanel } from '../containers/MenuPanel';
import { SrDecoderMenu } from './SrDecoderMenu';
import { SrTabularMenu } from './SrTabularMenu';
import { SrCanvas } from './SrCanvas';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        font-size:14px;
    }
`;

export const SrApp = ({ws, analog, logic}) =>{
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
                <MenuPanel ws={ws} toggleDecoderMenu={toggleDecoderMenu} toggleTabularMenu={toggleTabularMenu} logic={logic}/>
                <SrCanvas analog={analog} logic={logic} ws={ws}/>
                { (decoderMenu) ? <SrDecoderMenu /> : null }
                { (tabularMenu) ? <SrTabularMenu /> : null }
            </ScSrApp>
        </ThemeProvider>
    )
}
