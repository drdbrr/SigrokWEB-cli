import React, { useRef } from 'react';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrButton } from '../styled/ScSrButton';
import SrDropDownMenu from './SrDropDownMenu';

const SrChannelsMenuEntries = ({group, label}) =>{
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
                    onChange={(e)=>
                        item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked
                    }
                />
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    
    //ENABLE ALL
    const enable = useCallback(()=>group.forEach((item, i)=>channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = true));
    
    //DISABLE ALL
    const disable = useCallback(()=>group.forEach((item, i)=>channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = false));
    
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


const SrChannelsMenuContent=({channelGroups})=>{
    console.log('Render SrChannelsMenuContent');
    const channelsList = [];

    for (const [ key, value ] of Object.entries(channelGroups)) {
        channelsList.push(<SrChannelsMenuEntries key={key} group={Object.values(value)} label={key.charAt(0).toUpperCase() + key.slice(1)} />)
    }
    
    return(
        <ScSrDropDownContent >
            <div css={`padding-bottom: 10px`} >
                { channelsList }
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
