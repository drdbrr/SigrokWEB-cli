import React, { useState } from 'react';
import onClickOutside from "react-onclickoutside";
import { Menu, FormClose, FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
//import { selectedSessionVar } from '../ApolloClient';

const SrSessionsContent = ({selectSession, session, toggle, sessions, createSession, deleteSession})=>{
    console.log('Render SrSessionsContent');
    const newSession = () =>{
        createSession();
        toggle();
    };
    
    return(
        <ScSrDropDownContent>
            <div>
            { sessions.map((item)=>
                <ScSrDropDownItem key={item.id} isSelected={(session.id === item.id)} >
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

const SrSessionsMenu = ({sessions, session, selectSession, createSession, deleteSession}) =>{
    console.log('Render SrSessionsMenu');
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () =>setIsOpen(!isOpen);
    SrSessionsMenu.handleClickOutside = () => setIsOpen(false);
    const content = <SrSessionsContent selectSession={selectSession} session={session} sessions={sessions} createSession={createSession} toggle={toggle} deleteSession={deleteSession}/>
    
    return(
        <div>
            <ScSrDropDown onClick={toggle}>
                <span>{session.name}</span>
                <Menu size='small' color='white' />
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
};

const clickOutsideConfig = {
    handleClickOutside: () => SrSessionsMenu.handleClickOutside
};

export default onClickOutside(SrSessionsMenu, clickOutsideConfig); 
 
