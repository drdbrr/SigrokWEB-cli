import React from 'react';
import { Document } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import SrDropDownMenu from './SrDropDownMenu';

const SrFileMenuContent=()=>{
    console.log('Render SrFileMenuContent');
    return(
        <ScSrDropDownContent>
            <div css={`width:100px; height:100px; background-color:red`} >OMG</div>
        </ScSrDropDownContent>
    )
}

const SrFileMenu = (props) =>{
    const icon = <Document size='small' color='white' />
    return(
        <SrDropDownMenu icon={icon} >
            <SrFileMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrFileMenu
