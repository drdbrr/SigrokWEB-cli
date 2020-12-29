//import * as THREE from 'three';
import { Shape as ThShape, ShapeBufferGeometry as ThShapeBufferGeometry, Color as ThColor } from 'three';
import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { Text, Html } from '@react-three/drei';
import { SrAnalogPopUp, SrLogicPopUp } from './SrChannelPopUp';
//import { SrRowGroupSlider } from './SrRowGroupSlider';
import Roboto from '../fonts/Roboto.woff';
import { channelsVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

const labelShape = new ThShape();
    labelShape.moveTo(-14, 8);
    labelShape.lineTo(5,8);
    labelShape.lineTo(15,0);
    labelShape.lineTo(5,-8);
    labelShape.lineTo(-14,-8);
    
const labelGeometry = new ThShapeBufferGeometry( labelShape );

const SrRowGroupSlider = ({order, height, color, position, rowActionRef, rowsRef, linesRef, type})=>{
    const slRef = useRef();
    const matRef = useRef();
    
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    const rgbColor = new ThColor( parseInt(result[1], 16) / 1000, parseInt(result[2], 16) / 1000, parseInt(result[3], 16) / 1000)
    
    const over = useCallback(()=>{
        const overColor = new ThColor(0.059, 0.089, 0.120);
        matRef.current.color.set(overColor);
    }, []);
    
    const out = useCallback(()=>{
        matRef.current.color.set(rgbColor);
    }, []);
    
    const down = useCallback((e) => {
        rowActionRef.current.index = order.current[type].index;
        rowActionRef.current.down = true;
        rowActionRef.current.type = type;
        //rowActionRef.current.index = i;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
    }, []);
    
    const up = useCallback((e) => {
        rowActionRef.current.down = false;
        rowActionRef.current.type = null;
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (rowActionRef.current.down && rowActionRef.current.type === type/*rowActionRef.current.index === order.current[type].index*/) {
            //rowActionRef.current.moved = true;
            event.stopPropagation();
            //slRef.current.position.y -= event.movementY;
            //lineRef.current.position.y -= lineRef.current.scale.y / 2;
            rowsRef.current.position.y = linesRef.current.position.y -= event.movementY;
            
            const prevRow = Object.values(order.current).find( x => order.current[type].index - 1 === x.index)
            const nextRow = Object.values(order.current).find( x => order.current[type].index + 1 === x.index)
            
            if (rowsRef.current.position.y >= prevRow.rowRef.current.position.y - 200){
                const i = order.current[type].index;
                
                order.current[type].index = prevRow.index;
                prevRow.index = i;
            }
            

        }
    }, []);
    
    /*
    useEffect(()=>{
        const size = new THREE.Vector3()
        slRef.current.geometry.computeBoundingBox();
        slRef.current.geometry.boundingBox.getSize(size)
    }, []);
    */
    return(
        <mesh position={position} ref={slRef} onPointerUp={up} onPointerDown={down} onPointerMove={move} onPointerOut={out} onPointerOver={over} >
            <planeBufferGeometry attach="geometry" args={[25, height]}/>
            <meshStandardMaterial attach="material" color={color} ref={matRef}/>
        </mesh>
    )
}


const SrLogicChannelRow = ({ height, rowColor, i, text, rowRef, lineRef, rowActionRef })=>{
    console.log('SrLogicChannelRow:', text);
    const [ popUp, setPopUp ] = useState(false);
    const { size } = useThree();
    
    const down = useCallback((e) => {
        rowActionRef.current.index = i;
        rowActionRef.current.down = true;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
        console.log(e)
    }, []);

    const up = useCallback((e) => {
        
        if (!rowActionRef.current.moved)
            setPopUp(true);
        
        rowActionRef.current.moved = false;
        rowActionRef.current.down = false;
        rowActionRef.current.index = null;
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (rowActionRef.current.down && rowActionRef.current.index === i) {
            rowActionRef.current.moved = true;
            event.stopPropagation();
            
            lineRef.current.position.y = rowRef.current.position.y -= event.movementY;
            lineRef.current.position.y -= lineRef.current.scale.y / 2;
        }
    }, []);
    
    const matRef = useRef();
    
    const over = useCallback(()=>{
        matRef.current.color.set('red');
    }, []);
    
    const out = useCallback(()=>{
        matRef.current.color.set(rowColor)
    }, []);
    
    return(
        <group ref={rowRef} >
            <group position={[-size.width/2+35, 0, 3]}>
                <mesh position={[-3, 0, 0]}>
                    <Text
                        fontSize={12}
                        color={'black'}
                        font={Roboto}
                    >{text}</Text>
                </mesh>
                <mesh geometry={labelGeometry} onPointerUp={up} onPointerDown={down} onPointerMove={move} onPointerOut={out} onPointerOver={over} >
                    <meshStandardMaterial color={rowColor} ref={matRef} />
                </mesh>
                
                <SrLogicPopUp open={popUp} rowColor={rowColor} setOpen={setPopUp} rowRef={rowRef} lineRef={lineRef} />

            </group>
            <mesh scale-y={height}>
                <planeBufferGeometry attach="geometry" args={[size.width , 1]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
        </group>
    )
}

export const SrLogicChannelsRows = ({rowActionRef, order, logicRowsRef, logicLinesRef}) =>{
    const { size } = useThree();
    const { logic } = useReactiveVar(channelsVar);
    const logicRows = useMemo(()=>{
        const logicRows = [];
        logic.map((item, i)=>{
            rowActionRef.current.logicHeight += item.traceHeight + 15;
            logicRows.push(
            <SrLogicChannelRow
                key={item.name + i}
                i={i}
                text={item.name}
                rowRef={item.rowRef}
                lineRef={item.lineRef}
                rowActionRef={rowActionRef}
                rowColor={item.color}
                height={item.traceHeight}
            />);

        })
        return logicRows
    }, [logic]);
    
    useFrame(()=>{
        order.current.logic.height = rowActionRef.current.logicHeight = logic.reduce((total, obj) =>(obj.lineRef.current.visible) ? parseInt(obj.lineRef.current.scale.y) + parseInt(total) + 15 : total, 0);
        if (!rowActionRef.current.down){
            let loffset = 0;
            logic.map((item)=>{
                item.rowRef.current.position.y = loffset;
                item.lineRef.current.position.y = loffset;
                item.lineRef.current.position.y -= parseInt(item.lineRef.current.scale.y);
                item.rowRef.current.position.y -= parseInt(item.lineRef.current.scale.y)/2;
                if (item.lineRef.current.visible)
                    loffset -= parseInt(item.lineRef.current.scale.y) + 8;
            });
        }
    })
    
    return (<>
        <SrRowGroupSlider
            order={order}
            type={'logic'}
            rowsRef={logicRowsRef}
            linesRef={logicLinesRef}
        
            rowActionRef={rowActionRef}
            height={rowActionRef.current.logicHeight-60}
            color={'#24384d'}
            position={[-size.width/2+12, -rowActionRef.current.logicHeight/2+32, 2]}
        />
        { logicRows }
    </>)
}

const SrAnalogChannelRow = ({i, text, rowRef, lineRef, rowActionRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging}) =>{
    console.log('SrAnalogChannelRow:', text);
    const { size } = useThree();
    const [ popUp, setPopUp ] = useState(false);
    
    const down = useCallback((e) => {
        rowActionRef.current.index = i;
        rowActionRef.current.down = true;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
    }, []);

    const up = useCallback((e) => {
        if (!rowActionRef.current.moved)
            setPopUp(true);
        
        rowActionRef.current.moved = false;
        rowActionRef.current.down = false;
        
        rowActionRef.current.index = null;//????????
        
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (rowActionRef.current.down && rowActionRef.current.index === i) {
            rowActionRef.current.moved = true;
            event.stopPropagation();
            
            lineRef.current.position.y = rowRef.current.position.y -= event.movementY;
            lineRef.current.position.y -= lineRef.current.scale.y / 2;
        }
    }, []);
    
    const over = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set('red');
    }, []);
    
    const out = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set(rowColor);
    }, []);
    
    return(
        <group ref={rowRef}>
            <group position={[-size.width/2+35, 0, 2]}>
                <mesh position={[-3, 0, 0]}>
                    <Text
                        fontSize={12}
                        color={'black'}
                        font={Roboto}
                    >{text}</Text>
                </mesh>
                <mesh geometry={labelGeometry} onPointerUp={up} onPointerDown={down} onPointerMove={move} onPointerOut={out} onPointerOver={over} >
                    <meshStandardMaterial color={rowColor} />
                </mesh>
                
                <SrAnalogPopUp open={popUp} rowColor={rowColor} setOpen={setPopUp} rowRef={rowRef} lineRef={lineRef} pVertDivs={pVertDivs} nVertDivs={nVertDivs} divHeight={divHeight} vRes={vRes} autoranging={autoranging} />

            </group>
            
            <mesh position-y={divHeight/2}>
                <planeBufferGeometry attach="geometry" args={[size.width , divHeight]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
            
            <mesh position-y={-divHeight/2} >
                <planeBufferGeometry attach="geometry" args={[size.width , divHeight]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
            
        </group>
    )
}

export const SrAnalogChannelsRows = ({rowActionRef, order, analogRowsRef, analogLinesRef}) =>{
    const { size } = useThree();
    const { analog, logic } = useReactiveVar(channelsVar);
    const analogRows = useMemo(()=>{
        const analogRows = [];
        analog.map((item, i)=>{
            rowActionRef.current.analogHeight += (item.pVertDivs + item.nVertDivs) * item.divHeight;
            analogRows.push(
                <SrAnalogChannelRow
                    key={item.name + i}
                    i={logic.length + i}
                    text={item.name}
                    rowRef={item.rowRef}
                    lineRef={item.lineRef}
                    rowActionRef={rowActionRef}
                    rowColor={item.color}
                    
                    pVertDivs={item.pVertDivs}
                    nVertDivs={item.nVertDivs}
                    divHeight={item.divHeight}
                    vRes={item.vRes}
                    autoranging={item.autoranging}
                />);
        })
        return analogRows;
    }, [analog]);
    
    useFrame(()=>{
        order.current.analog.height = rowActionRef.current.analogHeight = analog.reduce((total, obj) =>(obj.lineRef.current.visible) ? parseInt(obj.pVertDivs + obj.nVertDivs) * obj.divHeight + total + 15 : total, 0);
        
        if (!rowActionRef.current.down){
            let aoffset = 0;
            analog.map((item)=>{
                item.lineRef.current.position.y = aoffset;
                item.rowRef.current.position.y = aoffset;
                item.lineRef.current.position.y -= (item.pVertDivs + item.nVertDivs) * item.divHeight;
                item.rowRef.current.position.y -= (item.pVertDivs + item.nVertDivs) * item.divHeight/2;
                if (item.lineRef.current.visible)
                    aoffset -= parseInt(item.pVertDivs + item.nVertDivs) * item.divHeight + 8;
            })
        }
    });
    
    return (<>
        <SrRowGroupSlider
            order={order}
            type={'analog'}
            rowsRef={analogRowsRef}
            linesRef={analogLinesRef}
            rowActionRef={rowActionRef}
            height={rowActionRef.current.analogHeight}
            color={'#31363b'}
            position={[-size.width/2+12, -rowActionRef.current.logicHeight/2-15, 2]}
        />
        { analogRows }
    </>)
} 
