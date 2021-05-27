import React from 'react';
import { Menu, FormClose } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import SrDropDownMenu from './SrDropDownMenu';

import { runStateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

const SrSessionsMenuContent = ({id, sessions, toggle, createSession, selectSession, deleteSession})=>{
    console.log('Render SrSessionsMenuContent');
    const newSession = () =>{
        createSession();
        toggle();
    };
    
    return(
        <ScSrDropDownContent>
            <div>
            { sessions.map((item)=>
                <ScSrDropDownItem key={item.id} isSelected={(id === item.id)} >
                    <span onClick={()=>{selectSession(item.id);toggle()}}  >{item.name}</span>
                    <FormClose size='small' color='white' onClick={()=>deleteSession(item.id)} />
                </ScSrDropDownItem>
            ) }
                <ScSrDropDownItem onClick={newSession} css={`border-top:2px solid grey`} >
                    <span>New...</span>
                </ScSrDropDownItem>
            </div>
        </ScSrDropDownContent>
    )
}

const SrSessionsMenu = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    const icon = <Menu size='small' color='white' />;
    return(
        <SrDropDownMenu label={ props.name } icon={icon} disabled={disabled} >
            <SrSessionsMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrSessionsMenu
 
