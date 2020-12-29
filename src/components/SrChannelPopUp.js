import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const SrLogicPopUpContent = ({lineRef, rowRef, rowColor}) =>{
    //#363636
    return(
        <div css={`padding:10px; padding-top:5px; background-color:#24384d; border:1px solid black; border-radius:4px;`}>
            <table css={`color:white; white-space: nowrap;`}>
                <tr>
                    <td>Name</td>
                    <td>
                        <input css={`width:70px`} type="text" list="list" onChange={(e)=>rowRef.current.children[0].children[0].children[0].text = e.target.value} defaultValue={rowRef.current.children[0].children[0].children[0].text} />
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
                    <td>Height</td>
                    <td>
                        <input 
                            name='hg'
                            type="number"
                            defaultValue={rowRef.current.children[1].scale.y}
                            onChange={(e)=>{
                                rowRef.current.children[1].scale.y = e.target.value;
                                lineRef.current.scale.y = e.target.value;
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
            </table>
        </div>
    )
}

export const SrLogicPopUp = ({open, setOpen, lineRef, rowRef, rowColor}) =>{
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

    const content =
        <Html position-x={17} position-y={20} ref={node} >
            <SrLogicPopUpContent lineRef={lineRef} rowRef={rowRef} rowColor={rowColor} />
        </Html>

    return (<>{ open && content }</>)
}

const SrAnalogPopUpContent = ({lineRef, rowRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging}) =>{
    return(
        <div css={`padding:10px; padding-top:5px; background-color:#24384d; border:1px solid black; border-radius:4px;`}>
    
            <table css={`color:white; white-space: nowrap;`}>
                <tr>
                    <td>Name</td>
                    <td>
                        <input css={`width:70px`} type="text" list="list" onChange={(e)=>rowRef.current.children[0].children[0].children[0].text = e.target.value} defaultValue={rowRef.current.children[0].children[0].children[0].text} />
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
                            name='hg'
                            type="number"
                            defaultValue={pVertDivs}
                            onChange={(e)=>{
                                rowRef.current.children[1].scale.y = e.target.value;
                                lineRef.current.scale.y = e.target.value;
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
                
                <tr>
                    <td>Neg divs</td>
                    <td>
                        <input
                            name='hg'
                            type="number"
                            defaultValue={nVertDivs}
                            onChange={(e)=>{
                                rowRef.current.children[1].scale.y = e.target.value;
                                lineRef.current.scale.y = e.target.value;
                            }}
                            css={`height:13px; position:relative; float:left; width:50px`}
                        />
                    </td>
                </tr>
                
                <tr>
                    <td>Div height</td>
                    <td>
                        <input 
                            name='hg'
                            type="number"
                            defaultValue={divHeight}
                            onChange={(e)=>{
                                rowRef.current.children[1].scale.y = e.target.value;
                                lineRef.current.scale.y = e.target.value;
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
            </table>
        </div>
    )
}

export const SrAnalogPopUp = ({open, setOpen, lineRef, rowRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging}) =>{
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

    const content =
        <Html position-x={17} position-y={20} ref={node} >
            <SrAnalogPopUpContent
                lineRef={lineRef}
                rowRef={rowRef}
                rowColor={rowColor}
                pVertDivs={pVertDivs}
                nVertDivs={nVertDivs}
                divHeight={divHeight}
                vRes={vRes}
                autoranging={autoranging}
            />
        </Html>

    return (<>{ open && content }</>)
}
