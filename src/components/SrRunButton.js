import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ScSrButton } from '../styled/ScSrButton';
import { CirclePlay, PauseFill }  from 'grommet-icons';
import { channelsVar } from '../ApolloClient';

const SrRunButton = forwardRef(({ ws }, ref) =>{
    const [ isRun, setRun ] = useState(false);
    
    useImperativeHandle(ref, () => ({
        startAcq(f){
            setRun(f);
        }
    }));
    
    return(
        <ScSrButton css={`float:left; padding-right:7px;`} onClick={ ()=>{
            const { logic, analog } = channelsVar();
            if (!isRun)
                logic.map((item)=>item.lineRef.current.children[0].geometry.setDrawRange(0, 0));
            ws.current.send(JSON.stringify({session_run:!isRun}))
        } } >
            <span css={`width:25px`} >{ isRun ? 'Stop' : 'Run' }</span>
            { isRun ? <PauseFill color="red" size="small" /> : <CirclePlay color="#3BD16F" size="small" /> }
        </ScSrButton>
    )
})

export default SrRunButton
