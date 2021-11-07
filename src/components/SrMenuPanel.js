import React, { useState, useCallback } from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import SrFileMenu from './SrFileMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { SessionsMenu } from '../containers/SessionsMenu';
import SrRunButton from './SrRunButton';
import { DecodersMenu } from '../containers/DecodersMenu';
import { SrTabularMenu } from './SrTabularMenu';

import { ChannelsMenu } from '../containers/ChannelsMenu';
import { OptionsPanel } from '../containers/OptionsPanel';

export const SrMenuPanel = ({ ws, session }) =>{
    console.log('Render SrMenuPanel');
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
    return(
        <ScSrMenuPanel>
            <SessionsMenu name={session.name} />
            <SrFileMenu />
            <DeviceMenu label={session.sourcename} />
            
            { ('devopts' in session) ?
                <OptionsPanel devopts={session.devopts} type={session.__typename} />
                : null
            }
            
            { ('channels' in session) ?
                <ChannelsMenu type={session.__typename} />
                : null
            }
            
            { (session.__typename === 'DeviceSession') ?
                <SrRunButton ws={ws} />
                : null
            }
            
            <div css={`margin-left:auto; display:flex; flex-direction:row; align-items:center;`}>
                <DecodersMenu decoderMenu={decoderMenu} toggleDecoderMenu={toggleDecoderMenu} />
                <SrTabularMenu tabularMenu={tabularMenu} toggleTabularMenu={toggleTabularMenu} />
                {/*<button  onClick={toggleTabularMenu} >open tabular</button>*/}
                
                {/* (tabularMenu) ? <SrTabularMenu toggleTabularMenu={toggleTabularMenu}/> : null */}
                
            </div>
        </ScSrMenuPanel>
    )
}
