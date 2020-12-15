import React from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import SrFileMenu from './SrFileMenu';
import { ChannelsMenu } from '../containers/ChannelsMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { Samplerates } from '../containers/Samplerates';
import { Samples } from '../containers/Samples';
import { SessionsMenu } from '../containers/SessionsMenu';

export const SrMenuPanel = ({toggleDecoderMenu, toggleTabularMenu, session, logic}) =>{
    console.log('Render SrMenuPanel');
    return(
        <ScSrMenuPanel>
            <SessionsMenu name={session.name} />
            <SrFileMenu />
            <DeviceMenu label={session.sourcename}/>
            
            { (session.config && session.config.includes('SAMPLERATE')) ?
                <Samplerates />
                : null
            }
            
            { (session.config && session.config.includes('LIMIT_SAMPLES'))?
                <Samples sample={session.sample} samples={session.samples} />
                : null
            }
            
            { (session.channels && (session.channels.includes('LOGIC') || session.channels.includes('ANALOG')) )?
                <ChannelsMenu />
                : null
            }
            
            <div css={`margin-left:auto`}>
                <button  onClick={toggleDecoderMenu} >open decoder</button>
                <button  onClick={toggleTabularMenu} >open tabular</button>
            </div>
        </ScSrMenuPanel>
    )
}
