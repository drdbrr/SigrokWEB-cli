import React, { useState } from 'react';
//import onClickOutside from "react-onclickoutside";
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import SrDropDownMenu from './SrDropDownMenu';

import { channelsVar } from '../ApolloClient';

const SrChannelsMenuContent=(/*{logic, analog}*/)=>{
    console.log('Render SrChannelsMenuContent');
    const {logic, analog } = channelsVar()
    const logicChannels = logic.map((item, i)=>{
        return(
            <div key={i} css={`border:1px solid black; display:flex; flex-direction:row; align-items:center; height:30px`} >
                <input defaultChecked={item.lineRef.current.visible} type="checkbox" id={i} name={item.name} value={item.name} onChange={(e)=>{item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked; }} />
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    /*
                <div css={`width:20px`} ></div>
                <label htmlFor='hg' css={`color:white`}>Height:</label>
                <input 
                    name='hg'
                    type="number"
                    defaultValue={item.rowRef.current.children[1].scale.y}
                    onChange={(e)=>{
                        item.rowRef.current.children[1].scale.y = item.lineRef.current.scale.y = e.target.value;
                        item.lineRef.current.position.y = item.rowRef.current.position.y - e.target.value/2;
                    }}
                    css={`width:30px`}
                />
                */
    
    return(
        <ScSrDropDownContent>
            <div>
                { logicChannels }
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
