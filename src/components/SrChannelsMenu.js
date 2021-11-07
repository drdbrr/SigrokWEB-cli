import React, { useRef } from 'react';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrButton } from '../styled/ScSrButton';
import SrDropDownMenu from './SrDropDownMenu';

import { runStateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

const SrChannelsMenuEntries = ({group, label, setChannel}) =>{
    console.log('Render SrChannelsMenuEntries')
    const channelGroup = group.map((item, i)=>{
        const ref = useRef()
        return(
            <div key={i + item.name} css={`flex: 1 0 21%; margin: 5px;`} >
                <input 
                    ref={ref}
                    defaultChecked={item.rowRef.current.visible}
                    type="checkbox"
                    name={item.name}
                    value={item.name}
                    onChange={(e)=>{
                        item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked;
                        setChannel({ variables: { input:[ { chName: item.name, enabled: e.target.checked } ]}});
                    }}
                />
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    
    //ENABLE ALL
    const enable = ()=>{
        const optsInput = group.map((item, i)=>{
            channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = true;
            return {chName: item.name, enabled:true};
        })
        setChannel({ variables: { input:optsInput}});
    };
    
    //DISABLE ALL
    const disable = ()=>{
        const optsInput = group.map((item, i)=>{
            channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = false;
            return {chName: item.name, enabled:false};
        })
        setChannel({ variables: { input:optsInput}});
    };
    
    return(
        <div>
            <div css={`border-bottom: 1px solid grey; padding-top:7px; padding-bottom:3px; `}>
                <span css={`color:white; padding-left:10px`} >{ label }</span>
            </div>
            <div css={`display: flex; flex-wrap: wrap;`}>
                { channelGroup}
            </div>
            <div css={`padding-top:5px`}>
                <ScSrButton css={`float:left; padding-right:7px;`} onClick={enable}>
                    <span>Enable all</span>
                </ScSrButton>
                <ScSrButton css={`float:left; padding-right:7px;`} onClick={disable}>
                    <span>Disable all</span>
                </ScSrButton>
            </div>
        </div>
    )
}


const SrChannelsMenuContent=({channelGroups, setChannel})=>{
    console.log('Render SrChannelsMenuContent');
    const ent = [];

    for (const [key, value] of Object.entries(channelGroups)) {
        ent.push(<SrChannelsMenuEntries setChannel={setChannel} key={key} group={Object.values(value)} label={key.charAt(0).toUpperCase() + key.slice(1)} />)
    }
    
    return(
        <ScSrDropDownContent >
            <div css={`padding-bottom: 10px`} >
                { ent }
            </div>
        </ScSrDropDownContent>
    )
}

export const SrChannelsMenu = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    return(
        <SrDropDownMenu label='Channels' disabled={disabled} >
            <SrChannelsMenuContent { ...props } />
        </SrDropDownMenu>
    )
}
