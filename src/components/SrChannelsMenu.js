import React, { useState } from 'react';
//import onClickOutside from "react-onclickoutside";
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import SrDropDownMenu from './SrDropDownMenu';

import { channelsVar } from '../ApolloClient';

const SrChannelsMenuContent=(/*{logic, analog}*/)=>{
    console.log('Render SrChannelsMenuContent');
    const {logic, analog } = channelsVar();
    const logicChannels = logic.map((item, i)=>{
        return(
            <div key={i + item.name} css={`border:1px solid black; display:flex; flex-direction:row; align-items:center; height:30px`} >
                <input defaultChecked={item.lineRef.current.visible} type="checkbox" name={item.name} value={item.name} onChange={(e)=>{item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked; }} />
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    
    const analogChannels = analog.map((item, i)=>{
        return(
            <div key={i + item.name} css={`border:1px solid black; display:flex; flex-direction:row; align-items:center; height:30px`} >
                <input defaultChecked={item.lineRef.current.visible} type="checkbox" name={item.name} value={item.name} onChange={(e)=>{item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked; }} />
                <label css={`color:white`}>{item.name}</label>
            </div>
        )
    });
    
    return(
        <ScSrDropDownContent>
            <div>
                { logicChannels}
            </div>
            <div>
                { analogChannels }
            </div>
        </ScSrDropDownContent>
    )
}

export const SrChannelsMenu = (props) =>{
    return(
        <SrDropDownMenu label='Channels' >
            <SrChannelsMenuContent { ...props } />
        </SrDropDownMenu>
    )
}
