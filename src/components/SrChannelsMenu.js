import React, { useState } from 'react';
//import onClickOutside from "react-onclickoutside";
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { SketchPicker } from 'react-color';
import SrDropDownMenu from './SrDropDownMenu';

const SrChannelsMenuContent=({logic, analog})=>{
    console.log('Render SrChannelsMenuContent');
    const [ colorOpen, setColorOpen ] = useState(false);
    const [ color, setColor ] = useState('#F17013');
    
    const logicChannels = logic.map((item, i)=>{
        return(
            <div key={i} css={`border:1px solid black; display:flex; flex-direction:row; align-items:center; height:30px`} >
                <input defaultChecked={item.lineRef.current.visible} type="checkbox" id={i} name={item.name} value={item.name} onChange={(e)=>{item.rowRef.current.visible = item.lineRef.current.visible = e.target.checked; }} />
                <label css={`color:white`}>{item.name}</label>
                <div css={`width:20px`} ></div>
                <label htmlFor='hg' css={`color:white`}>Height:</label>
                <input 
                    name='hg'
                    type="number"
                    defaultValue={item.rowRef.current.children[1].scale.y}
                    onChange={(e)=>{item.rowRef.current.children[1].scale.y = item.lineRef.current.scale.y = e.target.value;}}
                    css={`width:30px`}
                />
                
                <div css={`margin-right:10px; margin-left:10px; padding:3px; background: #fff; border-radius: 1px; box-shadow: 0 0 0 1px rgba(0,0,0,.1); display: inline-block; cursor: pointer;`} onClick={()=>setColorOpen(!colorOpen)}>
                    <div css={`width: 25px; height: 12px; border-radius: 2px; background: ${ color };`}/>
                </div>
            </div>
        );
    });
    
    const analogChannels = analog.map((item, i)=>{return(
        <div key={i} css={`border:1px solid black; display:flex; flex-direction:row; align-items:center; height:30px`} >
            OMG
        </div>
    )});
    
    return(
        <ScSrDropDownContent>
            <div>
                { (logic)? logicChannels : null}
                { (analog)? analogChannels : null}
                { (colorOpen)? 
                    <div css={`position:absolute; z-index:2;`}>
                        <div css={`position:fixed; top:0px; right:0px; bottom:0px; left:0px;`} onClick={ ()=>setColorOpen(false) }/>
                        <SketchPicker color={color} onChange={(color)=>setColor(color.hex)} /> 
                    </div>
                    : null}
            </div>
        </ScSrDropDownContent>
    )
}

/*
const SrChannelsMenu = ({logic, analog}) =>{
    console.log('Render SrChannelsMenu');
    const [ isOpen, setIsOpen ] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    SrChannelsMenu.handleClickOutside = () => setIsOpen(false);
    const content = <SrChannelsMenuContent logic={logic} analog={analog} toggleOpen={toggle} />
    return(
        <div> {/*WARNING: <---- MUST BE EXACT <DIV> */      /*}
            <ScSrDropDown onClick={toggle} >
                <span>Channels</span>
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
}

const clickOutsideConfig = {
    handleClickOutside: () => SrChannelsMenu.handleClickOutside
};

export default onClickOutside(SrChannelsMenu, clickOutsideConfig);
*/

const SrChannelsMenu = (props) =>{
    return(
        <SrDropDownMenu label='Channels' >
            <SrChannelsMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrChannelsMenu
