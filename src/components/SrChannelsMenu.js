import React, { useRef, useMemo } from 'react';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrButton } from '../styled/ScSrButton';
import SrDropDownMenu from './SrDropDownMenu';

import { channelsVar, runStateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

const SrChannelsMenuEntries = ({group, label, ws}) =>{
    console.log('Render SrChannelsMenuEntries')
    const channelGroup = group.map((item, i)=>{
        const ref = useRef()
        return(
            <div key={i + item.name} css={`flex: 1 0 21%; margin: 5px;`} >
                <input 
                    ref={ref}
                    checked={item.visible}
                    type="checkbox"
                    name={item.name}
                    value={item.name}
                    onChange={(e)=>{
                        //item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked;
                        ws.current.send(JSON.stringify({channel:{name: item.name, enable: e.target.checked}}))
                    }}
                />
                
                <label css={`color:white`}>{item.name}</label>
            </div>
        );
    });
    
    //REBUILD TO ARRAY FOR SINGLE PACKET
    const enable = ()=>group.map((item, i)=>{
        channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = true;
        ws.current.send(JSON.stringify({channel:{name: item.name, enable: true}}));
    })
    
    
    const disable = ()=>group.map((item, i)=>{
        channelGroup[i].props.children[0].ref.current.checked = item.rowRef.current.visible = item.lineRef.current.visible = false;
        ws.current.send(JSON.stringify({channel:{name: item.name, enable: false}}));
    })
    
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


const SrChannelsMenuContent=({ws})=>{
    console.log('Render SrChannelsMenuContent');
    const { logic, analog } = useReactiveVar(channelsVar);
    
    /*
    useMemo(()=>{
        console.log("OMG WE HERE----------------------->");
    }, [fof, channelsVar()]);
    */
    
    return(
        <ScSrDropDownContent>
        <div css={`padding-bottom: 10px`} >
            { logic.length ? 
                <SrChannelsMenuEntries group={logic} label={'Logic'} ws={ws}/>
                : null
            }
            { analog.length ? 
                <SrChannelsMenuEntries group={analog} label={'Analog'} ws={ws}/>
                : null
            }
        </div>
        </ScSrDropDownContent>
    )
}

export const SrChannelsMenu = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    const {analog, logic} = useReactiveVar(channelsVar);
    return(
        <SrDropDownMenu label='Channels' disabled={disabled} >
            <SrChannelsMenuContent { ...props } />
        </SrDropDownMenu>
    )
}
