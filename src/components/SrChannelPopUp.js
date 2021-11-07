import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Html } from '@react-three/drei';

import { channelsVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

import { PopoverPicker } from "./PopoverPicker";

const SrLogicPopUpContent = ({name, setChannel, lineRef, rowRef, rowColor}) =>{
    //color: '#363636'
    
    const colorInRef = useRef(null);
    
    useEffect(()=>{
        //ATTENTION: below onMount
        const optCopy = {text:rowRef.current.children[0].children[0].children[0].text, color: '#' + rowRef.current.children[1].material.color.getHexString(), enabled:rowRef.current.visible, traceHeight:rowRef.current.children[1].scale.y };
        
        colorInRef.current.style.backgroundColor = '#' + rowRef.current.children[1].material.color.getHexString();
        
        
        //ATTENTION: below onUnmount
        return ()=>{
            const newOptCopy = {text:rowRef.current.children[0].children[0].children[0].text, color: '#' + rowRef.current.children[1].material.color.getHexString(), enabled:rowRef.current.visible, traceHeight:rowRef.current.children[1].scale.y };
            
            let cnt = 0;
            const inputOpts = {chName: name};
            for (const [key, value] of Object.entries(newOptCopy)) {
                if (optCopy[key] !== value){
                    Object.assign(inputOpts, {[key]:value});
                    cnt++;
                }
            }
            
            (cnt) ? setChannel({variables:{input:[inputOpts]}}) : null;
    
        }
    }, []);
    
    const setRowColor = useCallback((e)=>{
        
        //set label color
        rowRef.current.children[0].children[1].material.color.setStyle(e);
        
        //set row background plane color
        rowRef.current.children[1].material.color.setStyle(e);
        
        //set color selector div color
        colorInRef.current.style.backgroundColor = e;
    }, []);
    
    return(
        <div css={`padding:10px; padding-top:5px; background-color:#24384d; border:1px solid black; border-radius:4px;`}>
            <table css={`color:white; white-space: nowrap;`}>
                <tr>
                    <td>Name</td>
                    <td>
                        <input css={`width:70px`} type="text" list="list" onChange={(e)=>{
                                rowRef.current.children[0].children[0].children[0].text = e.target.value;
                            }} 
                            defaultValue={rowRef.current.children[0].children[0].children[0].text} 
                        />
                    </td>
                </tr>
                <tr>
                    <td>Color</td>
                    <td>
                        <PopoverPicker inRef={colorInRef} color={'yellow'} onChange={setRowColor} />
                    </td>
                </tr>
                
                <tr>
                    <td>Height</td>
                    <td>
                        <input 
                            name='hg'
                            type="number"
                            defaultValue={rowRef.current.children[1].scale.y}
                            onChange={(e)=>{
                                rowRef.current.children[1].scale.y = e.target.valueAsNumber;
                                lineRef.current.scale.y = e.target.valueAsNumber;
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
            </table>
        </div>
    )
}

export const SrLogicPopUp = ({name, setChannel, open, setOpen, lineRef, rowRef, rowColor, testRef}) =>{
    console.log('Render SrChannelPopUp');

    const toggle = () =>setOpen(!open);
    const node = useRef();    

    const handleClick = e => {
        if (node.current && node.current.contains(e.target)){
            return;// inside click
        }
        setOpen(false);// outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, []);

    const content = <SrLogicPopUpContent name={name} setChannel={setChannel} lineRef={lineRef} rowRef={rowRef} rowColor={rowColor} testRef={testRef}/>

    return (
        <Html position-x={17} position-y={20} ref={node}>
            { (open) ? content : null }
        </Html>
    )
}

const SrAnalogPopUpContent = ({testRef, name, setChannel, text, lineRef, rowRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging}) =>{
    
    console.log('testRef----------->', testRef.current);
    
    const nDivsRef= useRef();
    const pDivsRef= useRef();
    const hDivRef= useRef();
    
    const { analog } = useReactiveVar(channelsVar);
    
    /*
    useEffect(()=>{
        pDivsRef.current.value = analog[name].pVertDivs;
    }, []);
    */
    
    return(
        <div css={`padding:10px; padding-top:5px; background-color:#24384d; border:1px solid black; border-radius:4px;`}>
    
            <table css={`color:white; white-space: nowrap;`}>
                <tbody>
                
                <tr>
                    <td>Name</td>
                    <td>
                        <input css={`width:70px`} type="text" list="list" onChange={(e)=>{
                                rowRef.current.children[0].children[0].children[0].text = e.target.value;
                                setChannel({variables:{input:[{chName:name, text:e.target.value}] }});
                            }}
                            defaultValue={rowRef.current.children[0].children[0].children[0].text}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Color</td>
                    <td>
                        <div css={`float:left;background-color: #4c647f; border: 1px solid black; border-radius: 3px; padding:6px;`}>
                            <div css={`width:50px; height:8px; background-color:${rowColor};`}></div>
                        </div>
                    </td>
                </tr>
                
                <tr>
                    <td>Pos divs</td>
                    <td>
                        <input
                            ref={pDivsRef}
                            name='hg'
                            type="number"
                            defaultValue={pVertDivs}
                            onChange={(e)=>{
                                const pHeight = e.target.value * hDivRef.current.value;
                                
                                const g = new Float32Array ([-840, pHeight, 0, 840, pHeight, 0, -840, 0, 0, 840, 0, 0]);
                                
                                rowRef.current.children[1].geometry.attributes.position.array = g;
                                
                                rowRef.current.children[1].geometry.attributes.position.needsUpdate = true;
                                
                                rowRef.current.children[3].position.y = pHeight;
                                
                                
                                setChannel({variables:{input:[{chName:name, pVertDivs: parseInt(e.target.value)}] }});
                                //setChannel({variables:{chName:name, param:'pVertDivs', value:e.target.value}});
                                
                                //const newChannels = {...channels};
                                
                                //const newChannels = {...channelsVar()};
                                
                                //const ind = newChannels.analog.findIndex((i)=>i.name === text);
                                
                                //newChannels.analog[name].pVertDivs = parseInt(e.target.value);
                                
                                //channelsVar(newChannels);
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
                
                <tr>
                    <td>Neg divs</td>
                    <td>
                        <input
                            ref={nDivsRef}
                            name='hg'
                            type="number"
                            defaultValue={nVertDivs}
                            onChange={(e)=>{
                                const nHeight = e.target.value * hDivRef.current.value;
                                
                                const g = new Float32Array ([-840, 0, 0, 840, 0, 0, -840, -nHeight, 0, 840, -nHeight, 0]);
                                
                                rowRef.current.children[2].geometry.attributes.position.array = g;
                                
                                rowRef.current.children[2].geometry.attributes.position.needsUpdate = true;
                                
                                rowRef.current.children[4].position.y = -nHeight;
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
                
                <tr>
                    <td>Div height</td>
                    <td>
                        <input
                            ref={hDivRef}
                            name='hg'
                            type="number"
                            defaultValue={testRef.current.divHeight}
                            onChange={(e)=>{
                                testRef.current.divHeight = e.target.value;
                                const pHeight = pDivsRef.current.value * e.target.value;
                                const nHeight = nDivsRef.current.value * e.target.value;
                                
                                const pg = new Float32Array ([-840, pHeight, 0, 840, pHeight, 0, -840, 0, 0, 840, 0, 0]);
                                
                                const ng = new Float32Array ([
                                -840, 0, 0,
                                840, 0, 0,
                                -840, -nHeight, 0,
                                840, -nHeight, 0]);
                                
                                rowRef.current.children[1].geometry.attributes.position.array = pg;
                                rowRef.current.children[2].geometry.attributes.position.array = ng;
                                
                                rowRef.current.children[1].geometry.attributes.position.needsUpdate = true;
                                rowRef.current.children[2].geometry.attributes.position.needsUpdate = true;
                                
                                rowRef.current.children[3].position.y = pHeight;
                                rowRef.current.children[4].position.y = -nHeight;
                                
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
                
                <tr>
                    <td>Vertical resolution</td>
                    <td>
                        <select defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} >
                            <option value="DEFAULT">{vRes}</option>
                        </select>
                    </td>
                </tr>
                
                <tr>
                    <td>Conversion</td>
                    <td>
                        <select defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} >
                            <option value="DEFAULT">none</option>
                        </select>
                    </td>
                </tr>
                
                <tr>
                    <td>Conversion thres</td>
                    <td>
                        <select disabled defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} >
                            <option value="DEFAULT">none</option>
                        </select>
                    </td>
                </tr>
                
                <tr>
                    <td>Show traces</td>
                    <td>
                        <select disabled defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} >
                            <option value="DEFAULT">none</option>
                        </select>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}

export const SrAnalogPopUp = ({setChannel, name, text, open, setOpen, lineRef, rowRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging, testRef}) =>{
    console.log('Render SrChannelPopUp');

    const node = useRef();

    const handleClick = e => {
        if (node.current && node.current.contains(e.target)){
            return;// inside click
        }
        setOpen(false);// outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, []);
    
    const content =
        <SrAnalogPopUpContent
            text={text}
            lineRef={lineRef}
            rowRef={rowRef}
            rowColor={rowColor}
            pVertDivs={pVertDivs}
            nVertDivs={nVertDivs}
            divHeight={divHeight}
            vRes={vRes}
            autoranging={autoranging}
            
            name={name}
            setChannel={setChannel}
            testRef={testRef}
        />

    return (
        <Html position-x={17} position-y={20} ref={node}>
            { (open) ? content : null }
        </Html>
    )
}
