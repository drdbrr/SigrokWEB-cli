import React, { memo, useMemo } from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import SrFileMenu from './SrFileMenu';
import { SrChannelsMenu } from './SrChannelsMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { Samplerates } from '../containers/Samplerates';
import { Samples } from '../containers/Samples';
import { SessionsMenu } from '../containers/SessionsMenu';

import { useReactiveVar } from '@apollo/client';
import { testVar } from '../ApolloClient';

export const SrMenuPanel = ({toggleDecoderMenu, toggleTabularMenu, session, logic}) =>{
    console.log('Render SrMenuPanel');
    
    
    //const session = testVar();
    
    return(
        <ScSrMenuPanel>
            <SessionsMenu session={session} />
            <SrFileMenu />
            <DeviceMenu session={session} />
            
            { (session.config && session.config.includes('SAMPLERATE')) ?
                <Samplerates />
                : null
            }
            
            { (session.config && session.config.includes('LIMIT_SAMPLES'))?
                <Samples sample={session.sample} samples={session.samples} />
                : null
            }
            
            { (session.channels && (session.channels.includes('LOGIC') || session.channels.includes('ANALOG')) )?
                <SrChannelsMenu />
                : null
            }
            
            <div css={`margin-left:auto`}>
                <button  onClick={toggleDecoderMenu} >open decoder</button>
                <button  onClick={toggleTabularMenu} >open tabular</button>
            </div>
        </ScSrMenuPanel>
    )
}
