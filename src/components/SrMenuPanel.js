import React, { useState, useCallback } from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import SrFileMenu from './SrFileMenu';
import { ChannelsMenu } from '../containers/ChannelsMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { Samplerates } from '../containers/Samplerates';
import { Samples } from '../containers/Samples';
import { SessionsMenu } from '../containers/SessionsMenu';
import SrRunButton from './SrRunButton';

import { DecodersMenu } from '../containers/DecodersMenu';

import { SrTabularMenu } from './SrTabularMenu';

export const SrMenuPanel = ({ ws, btnRef, session }) =>{
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
            <DeviceMenu label={session.sourcename}/>
            
            { (session.config && session.config.includes('samplerate')) ?
                <Samplerates />
                : null
            }
            
            { (session.config && session.config.includes('limit_samples'))?
                <Samples sample={session.sample} samples={session.samples} />
                : null
            }
            
            { (session.channels && (session.channels.includes('logic') || session.channels.includes('analog')) )?
                <ChannelsMenu ws={ws} />
                : null
            }
            
            { (session.type === 'device') ?
                <SrRunButton ref={btnRef} ws={ws} />
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
