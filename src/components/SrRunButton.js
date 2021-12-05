import React from 'react';
import { ScSrButton } from '../styled/ScSrButton';
import { CirclePlay, PauseFill }  from 'grommet-icons';
import { runStateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

export const SrRunButton = ({ws}) =>{
    const isRun = useReactiveVar(runStateVar);
    
    return(
        <ScSrButton css={`float:left; padding-right:7px; cursor: pointer;`} onClick={()=>ws.current.send(JSON.stringify({run:!isRun})) } >
            <span css={`width:25px`} >{ isRun ? 'Stop' : 'Run' }</span>
            { isRun ? <PauseFill color="red" size="small" /> : <CirclePlay color="#3BD16F" size="small" /> }
        </ScSrButton>
    )
}
