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

export const SrFileMenu = (props) =>{
    const disabled = false;
    const icon = <Document size='small' color='white' />
    return(
        <SrDropDownMenu icon={icon} disabled={disabled} >
            <SrFileMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}
