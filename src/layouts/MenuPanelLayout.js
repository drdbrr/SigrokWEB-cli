import React, { useState, useCallback } from 'react';
import { ScSrMenuPanel } from '../styled/ScSrMenuPanel';
import { SessionsMenu } from '../containers/SessionsMenu';
import { DeviceMenu } from '../containers/DeviceMenu';
import { OptionsPanel } from '../containers/OptionsPanel';
import { ChannelsMenu } from '../containers/ChannelsMenu';
import { DecodersMenu } from '../containers/DecodersMenu';
import { SrFileMenu } from '../components/SrFileMenu';
import { SrRunButton } from '../components/SrRunButton';
import SrLoading from '../components/SrLoading';
import { SrTabularMenu } from '../components/SrTabularMenu';

import { useGetSessions } from '../operations/queries/useGetSessions';

const MenuPanelLayout = () =>{
    console.log('Render MenuPanelLayout');
    const [ select, {data: {sessions, session}, loading} ] = useGetSessions();
    
    //------------------------------------------------------------
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
    //------------------------------------------------------------
    
    if (loading) return <SrLoading />

    return(
        <ScSrMenuPanel>
            <SessionsMenu sessions={sessions} session={session} />
            <SrFileMenu />
            <DeviceMenu session={session} />
            
            { ('devopts' in session) ?
                <OptionsPanel devopts={session.devopts} type={session.__typename} />
                : null
            }
            
            { ('channels' in session) ?
                <ChannelsMenu type={session.__typename} />
                : null
            }
            
            { (session.__typename === 'DeviceSession') ?
                <SrRunButton />
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

export default MenuPanelLayout;
 
