import React, { useRef, useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

const SrLogicPopUpContent = ({lineRef, rowRef, rowColor}) =>{
    //#363636
    return(
        <div css={`padding:10px; padding-top:5px; display:flex; flex-direction:column; background-color:#24384d; border:1px solid black; border-radius:4px`}>
            <div css={`width: max-content`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Name</span>
                <input css={`height:13px; position:relative; float:left; width:70px`} type="text" list="list" onChange={(e)=>rowRef.current.children[0].children[0].children[0].text = e.target.value} defaultValue={rowRef.current.children[0].children[0].children[0].text} />
                {/*
                <datalist id="list">
                    <option>DATA</option>
                    <option>CLK</option>
                    <option>EN</option>
                    <option>IN</option>
                    <option>OUT</option>
                    <option>RX</option>
                    <option>TX</option>
                    <option>SDA</option>
                    <option>SCL</option>
                    <option>RST</option>
                </datalist>
                */}
            </div>
            
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Height:</span>
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
            </div>
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={` color:white; padding-right: 10px; position:relative; float:left`}>Color:</span>
                <div css={`float:left;background-color: #474747;border: 1px solid black; border-radius: 3px; padding:6px;`}>
                
                    <div css={`width:50px; height:8px; background-color:${rowColor};`}></div>
                
                </div>
            </div>
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
        <div css={`padding:10px; padding-top:5px; display:flex; flex-direction:column; background-color:#24384d; border:1px solid black; border-radius:4px`}>
            <div css={`width: max-content`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Name</span>
                <input css={`height:13px; position:relative; float:left; width:70px`} type="text" list="list" onChange={(e)=>rowRef.current.children[0].children[0].children[0].text = e.target.value} defaultValue={rowRef.current.children[0].children[0].children[0].text} />
            </div>
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={` color:white; padding-right: 10px; position:relative; float:left`}>Color:</span>
                <div css={`float:left;background-color: #474747;border: 1px solid black; border-radius: 3px; padding:6px;`}>
                
                    <div css={`width:50px; height:8px; background-color:${rowColor};`}></div>
                
                </div>
            </div>
            
            
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Pos divs:</span>
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
            </div>
            
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Neg divs:</span>
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
            </div>
            
            
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Div height:</span>
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
            </div>
            
            <div css={`width: max-content;padding-top:10px;`} >
                <span css={`color:white; padding-right: 10px; position:relative; float:left`}>Vertical resolution:</span>
                
                
                <select defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} >
                    <option value="DEFAULT">{vRes}</option>
                
                        { /*drivers.map((item, i)=>
                            <option key={i} value={item} >{item}</option>
                        ) */}
                </select>
                
                
            </div>
            
            
            
            
            <div css={`width: max-content;padding-top:10px;`} >
                <div css={`color:white; padding-right: 10px; position:relative; float:left`}>
                    <input defaultChecked={autoranging} type="checkbox" />
                    <label css={`color:white`}>Autoranging</label>
                </div>
            </div>
            
            
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
