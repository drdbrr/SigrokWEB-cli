import React, { useRef } from 'react';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrButton } from '../styled/ScSrButton';
import SrDropDownMenu from './SrDropDownMenu';

import { channelsVar } from '../ApolloClient';

const SrChannelsMenuEntries = ({group, label}) =>{
    console.log('Render SrChannelsMenuEntries')
    const channelGroup = group.map((item, i)=>{
        const ref = useRef()
        return(
            <div key={i + item.name} css={`flex: 1 0 21%; margin: 5px;`} >
                <input ref={ref} defaultChecked={item.lineRef.current.visible} type="checkbox" name={item.name} value={item.name} onChange={(e)=>{item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked; }} />
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    
    const enable = ()=>{
        group.map((item, i)=> channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = true)
    }
    
    const disable = ()=>{
        group.map((item, i)=> channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = false)
    }
    
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


const SrChannelsMenuContent=()=>{
    console.log('Render SrChannelsMenuContent');
    const { logic, analog } = channelsVar();
    
    console.log('channelsVar---------------->', channelsVar());
    
    return(
        <ScSrDropDownContent>
        <div css={`padding-bottom: 10px`} >
            { logic.length ? 
                <SrChannelsMenuEntries group={logic} label={'Logic'}/>
                : null
            }
            { analog.length ? 
                <SrChannelsMenuEntries group={analog} label={'Analog'}/>
                : null
            }
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
