import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const SrLogicPopUp = ({lineRef, rowRef}) =>{
    //Height, color, text
    return(
        <div css={`padding:10px; padding-top:5px; display:flex; flex-direction:column; background-color:#363636; border:1px solid black; border-radius:4px`}>
            <div css={`width: max-content`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Name</span>
                <input  css={`height:13px; position:relative; float:left; width:50px`} type="text" list="cars" />
                <datalist id="cars">
                    <option>Volvo</option>
                    <option>Saab</option>
                    <option>Mercedes</option>
                    <option>Audi</option>
                </datalist>
            </div>
            
            <div css={`width:20px`} ></div>
                <label htmlFor='hg' css={`color:white`}>Height:</label>
                <input 
                    name='hg'
                    type="number"
                    defaultValue={rowRef.current.children[1].scale.y}
                    onChange={(e)=>{
                        //rowRef.current.children[1].scale.y = lineRef.current.scale.y = e.target.value;
                        //lineRef.current.position.y = rowRef.current.position.y - e.target.value/2;
                        console.log('')
                    }}
                    css={`width:30px`}
                />
            
            <div css={`width: max-content;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Color</span>
                <input css={`height:13px; width:50px`} type="text" name="myText" value="Norway" selectBoxOptions="Canada;Denmark;Finland;Germany;Mexico"/>
            </div>
        </div>
    )
}

export const SrChannelPopUp = ({open, setOpen, lineRef, rowRef}) =>{
    console.log('Render SrChannelPopUp');
    const toggle = () =>setOpen(!open);
    const node = useRef();    
    
    const handleClick = e => {
        if (node.current && node.current.contains(e.target))
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
            <SrLogicPopUp rowRef={rowRef} lineRef={lineRef}/>
        </Html>
            
    return (<>{ open && content }</>)
} 
