import React, { useRef, useMemo, useState, useImperativeHandle, forwardRef } from 'react';
import { ScSrButton } from '../styled/ScSrButton';
import { CirclePlay, PauseFill }  from 'grommet-icons';
import { channelsVar, runStateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

const SrRunButton = forwardRef(({ ws }, ref) =>{
    const [ isRun, setRun ] = useState(false);
    
    const isRn = useReactiveVar(runStateVar);
    
    return(
        <ScSrButton css={`float:left; padding-right:7px; cursor: pointer;`} onClick={ ()=>{
            const { logic, analog } = channelsVar();
            if (!isRn)
                logic.map((item)=>item.lineRef.current.children[0].geometry.setDrawRange(0, 0));
            ws.current.send(JSON.stringify({session_run:!isRn}))
        } } >
            <span css={`width:25px`} >{ isRn ? 'Stop' : 'Run' }</span>
            { isRn ? <PauseFill color="red" size="small" /> : <CirclePlay color="#3BD16F" size="small" /> }
        </ScSrButton>
    )
})

export default SrRunButton
