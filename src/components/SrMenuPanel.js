import React, { memo, useMemo } from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import SrFileMenu from './SrFileMenu';
import SrChannelsMenu from './SrChannelsMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { Samplerates } from '../containers/Samplerates';
import { Samples } from '../containers/Samples';
import { SessionsMenu } from '../containers/SessionsMenu';

export const SrMenuPanel = memo(({toggleDecoderMenu, toggleTabularMenu, session, sessions, logic}) =>{
    console.log('Render SrMenuPanel');
    return(
        <ScSrMenuPanel>
            { (session)?
                <SessionsMenu sessions={sessions} session={session} />
                : null
            }
            
            { <SrFileMenu /> }
            { (session)?
                <DeviceMenu session={session} />
                : null
            }
            
            
            { (session && session.samplerates)?
                <Samplerates samplerates={session.samplerates} samplerate={session.samplerate} />
                : null
            }
            
            { (session && session.samples)?
                <Samples sample={session.sample} samples={session.samples} />
                : null
            }
            
            { (session && (logic))?
                <SrChannelsMenu logic={logic} analog={session.analog} />
                : null
            }
            
            <div css={`margin-left:auto`}>
                <button  onClick={toggleDecoderMenu} >open decoder</button>
                <button  onClick={toggleTabularMenu} >open tabular</button>
            </div>
        </ScSrMenuPanel>
    )
})
