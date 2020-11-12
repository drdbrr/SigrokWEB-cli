import React, { useState } from 'react';
import onClickOutside from "react-onclickoutside";
import { FormDown, Document } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';

const SrFileMenuContent=()=>{
    console.log('Render SrFileMenuContent');
    return(
        <ScSrDropDownContent>
            <div css={`width:100px; height:100px; background-color:red`} >OMG</div>
        </ScSrDropDownContent>
    )
}

const SrFileMenu = () =>{
    console.log('Render SrFileMenu');
    const [ isOpen, setIsOpen ] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    SrFileMenu.handleClickOutside = () => setIsOpen(false);
    const content = <SrFileMenuContent toggleOpen={toggle} />
    return(
        <div> {/*WARNING: <---- MUST BE EXACT <DIV> */}
            <ScSrDropDown onClick={toggle} >
                <Document size='small' color='white' />
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => SrFileMenu.handleClickOutside
};

export default onClickOutside(SrFileMenu, clickOutsideConfig);
