import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const SrChannelPopUp = ({open, setOpen}) =>{
    console.log('Render SrChannelPopUp');
    const toggle = () =>setOpen(!open);
    const node = useRef();    
    
    const handleClick = e => {
        if (node.current.contains(e.target))
            return;// inside click
        setOpen(false);// outside click
    };
    
    const handleChange = () => setOpen(false);

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, []);
    
    const content =
        <Html position-x={17} position-y={20} ref={node}>
        <div css={`padding-left:10px; padding-top:5px; display:flex; flex-direction:column; background-color:#363636; border:1px solid black; border-radius:4px`}>
            <div css={`width: max-content`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Name</span>
                <input  css={`height:20px; position:relative; float:left; width:50px`} type="text" list="cars" />
                <datalist id="cars">
                    <option>Volvo</option>
                    <option>Saab</option>
                    <option>Mercedes</option>
                    <option>Audi</option>
                </datalist>
            </div>
    
    <div css={`width: max-content;`} >
    <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Color</span>
<input css={`height:20px; width:50px`} type="text" name="myText" value="Norway" selectBoxOptions="Canada;Denmark;Finland;Germany;Mexico"/>
    </div>
    </div>
            </Html>
            
    return( <>{ open && content }</> )
} 

export default SrChannelPopUp
