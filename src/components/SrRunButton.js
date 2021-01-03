import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { ScSrButton } from '../styled/ScSrButton';
import statusGrey from '../styled/icons/status-grey.svg';

import { CirclePlay }  from 'grommet-icons';

const SrRunButtonn = ({ws, btnRef}) =>{
    const [ isRun, setRun ] = useState(false);
    return(
        <ScSrButton css={`float:left; padding-right:7px;`} onClick={ ()=> ws.current.send(JSON.stringify({session_run:!isRun})) } >
            <span>{ isRun ? 'Stop' : 'Run' }</span>
            <CirclePlay color="white" size='small'/>
            {/*<img css={`height:15px`} src={statusGrey} className="App-logo" alt="logo" />*/}
        </ScSrButton>
    )
}

const SrRunButton = forwardRef(({ ws }, ref) =>{
    const [ isRun, setRun ] = useState(false);
    
    useImperativeHandle(ref, () => (setRun));
    
    return(
        <ScSrButton css={`float:left; padding-right:7px;`} onClick={ ()=> ws.current.send(JSON.stringify({session_run:!isRun})) } >
            <span>{ isRun ? 'Stop' : 'Run' }</span>
            <CirclePlay color="white" size='small'/>
            {/*<img css={`height:15px`} src={statusGrey} className="App-logo" alt="logo" />*/}
        </ScSrButton>
    )
})

export default SrRunButton
