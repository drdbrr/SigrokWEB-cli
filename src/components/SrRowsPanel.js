import * as THREE from 'three';
import React, { useRef, useMemo, useState, useCallback } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { Text, Html } from '@react-three/drei';
import { channelsVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';
import { SrChannelPopUp } from './SrChannelPopUp';
import { SrRowGroupSlider } from './SrRowGroupSlider';
import { SrLogicLine } from './SrLogicLine';

import Roboto from '../fonts/Roboto.woff';
import clamp from 'lodash-es/clamp';
import get from 'lodash-es/get';
import swap from 'lodash-move';

//const rowHeight = 50;

const labelShape = new THREE.Shape();
    labelShape.moveTo(-14, 8);
    labelShape.lineTo(5,8);
    labelShape.lineTo(15,0);
    labelShape.lineTo(5,-8);
    labelShape.lineTo(-14,-8);
    
const labelGeometry = new THREE.ShapeBufferGeometry( labelShape );
    
const SrLogicChannelRow = ({ height, rowColor, i, text, rowRef, lineRef, rowActionRef })=>{
    console.log('SrLogicChannelRow:', text);
    const [ popUp, setPopUp ] = useState(false);
    const { size } = useThree();
    
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
        <group ref={rowRef} >
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
                
                <SrChannelPopUp open={popUp} rowColor={rowColor} setOpen={setPopUp} rowRef={rowRef} lineRef={lineRef} />

            </group>
            <mesh scale-y={height}>
                <planeBufferGeometry attach="geometry" args={[size.width , 1]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
        </group>
    )
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
        if (rowActionRef.current.down) {
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
                
                <SrChannelPopUp open={popUp} rowColor={rowColor} setOpen={setPopUp} rowRef={rowRef} lineRef={lineRef} pVertDivs={pVertDivs} nVertDivs={nVertDivs} divHeight={divHeight} vRes={vRes} autoranging={autoranging} />

            </group>
            
            <mesh>
                <planeBufferGeometry attach="geometry" args={[size.width , 1]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
            
        </group>
    )
}

function useRowAnimation (arr, rowActionRef, height, lco, vis, gap){
    useFrame(()=>{
        if (!rowActionRef.current.down){
            let offset = 0
            arr.map((item)=>{
                const h = parseInt(get(item, height));
                item.rowRef.current.position.y = offset;
                item.lineRef.current.position.y = offset;
                item.rowRef.current.position.y -= h;
                item.lineRef.current.position.y -= h / lco;
                if (get(item, vis))
                    offset -= h + gap;
            })
        }
    })
    return null
}

const SrRowsPanel =({linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef})=>{
    console.log('Render SrRowsPannel');
    const { size } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowActionRef = useRef({ index: null, down: false, moved:false, logicHeight:0, analogHeight:0, dHeight:0});
    
    const { logic, analog } = useReactiveVar(channelsVar);
    
    const decoders = [];
    
    const logicRowsRef = useRef();
    const logicLinesRef = useRef();
    
    const analogRowsRef = useRef();
    const analogLinesRef = useRef();
    
    const order = useRef({});
    
    const [ logicRows, logicLines, analogRows, analogLines ] = useMemo(()=>{
        const logicRows = [];
        const logicLines = [];
        const analogRows = [];
        const analogLines = [];
        
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
            
            logicLines.push(
            <SrLogicLine
                key={item.name + i + 'srl'}
                i={i}
                lineRef={item.lineRef}
                height={item.traceHeight}
            />);
        });
        
        analog.map((item, i)=>{
            rowActionRef.current.analogHeight += (item.pVertDivs + item.nVertDivs) * item.divHeight;
            
            analogRows.push(
            <SrAnalogChannelRow
                key={item.name + i}
                i={-i + logic.length}
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
            
            analogLines.push(
            <SrLogicLine
                key={item.name + i + 'sra'}
                i={-i + logic.length}
                lineRef={item.lineRef}
                height={34}
            />);
        });
        
        order.current = {
            logic:{index:0, rowRef:logicRowsRef, lineRef:logicLinesRef, height:rowActionRef.current.logicHeight},
            analog:{index:1, rowRef:analogRowsRef, lineRef:analogLinesRef, height:rowActionRef.current.analogHeight}
        };
        
        return [logicRows, logicLines, analogRows, analogLines]
    }, [logic, analog]);
    
    
    //const order = useRef([]);
    //useMemo(()=>logic.map((_, index) =>order.current.push(index)), [logic]);
    
    //let prevRow = null;
    useFrame(()=>{
        order.current.logic.height = rowActionRef.current.logicHeight = logic.reduce((total, obj) =>(obj.lineRef.current.visible) ? parseInt(obj.lineRef.current.scale.y) + parseInt(total) + 15 : total, 0);
        order.current.analog.height = rowActionRef.current.analogHeight = analog.reduce((total, obj) =>(obj.lineRef.current.visible) ? parseInt(obj.pVertDivs + obj.nVertDivs) * obj.divHeight + total + 15 : total, 0);
        
        /*
        if (rowActionRef.current.down && rowActionRef.current.index !== null && mouseRef.current.dy ){
            const {lineRef, rowRef} = logic[rowActionRef.current.index];
            lineRef.current.position.y = rowRef.current.position.y -= mouseRef.current.dy;
            lineRef.current.position.y -= 25;
            
            const curRow = clamp(Math.round(rowRef.current.position.y / rowHeight), 0, logic.length - 1);
            
            if( curRow !== prevRow && prevRow !== null){
                
                const newOrder = swap(order.current, rowActionRef.current.index, curRow);
                
                const ind = order.current.indexOf(rowActionRef.current.index);
                
                order.current = newOrder;
                
                const ff = logic[order.current[ind]];
                const pp = ind * rowHeight;
                ff.lineRef.current.position.y = pp - 25;
                ff.rowRef.current.position.y = pp;
            }
            prevRow = curRow;
        }
        */
        /*
        if (!rowActionRef.current.down && rowActionRef.current.index !== null){
            const pos = order.current.indexOf(rowActionRef.current.index) * -rowHeight;
            const { lineRef, rowRef } = logic[rowActionRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 17;
            rowActionRef.current.index = null;
        }*/
        
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
        
        if (!rowActionRef.current.down){
            let offset = 0
            Object.values(order.current).map((item, i)=>{
                item.rowRef.current.position.y = offset;
                item.lineRef.current.position.y = offset;
                offset -= item.height;
            })
        }
        
        if (!mouseRef.current.rmb || rowsGroupRef.current.position.y > size.height/2 - 40)
            rowsGroupRef.current.position.y = size.height/2 - 40
    });
    
    //useRowAnimation(order.current, rowActionRef, 'height', 1, 'height', 0);
    //useRowAnimation(logic, rowActionRef, 'lineRef.current.scale.y', 2, 'lineRef.current.visible', 8);
    //useRowAnimation(analog, rowActionRef, 'height', 2, 'lineRef.current.visible');
    
    return(<>
        <mesh position={barPos} >
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
            <meshStandardMaterial color="#3c3c3c" roughness={0.75} metalness={0.3} />
        </mesh>
        <group ref={rowsGroupRef} position-y={size.height/2} >
            
            <group ref={logicRowsRef}>
            { (logicRows.length) ?
                <SrRowGroupSlider height={rowActionRef.current.logicHeight-60} color={'#24384d'} position={[-size.width/2+25, -rowActionRef.current.logicHeight/2+32, 2 ]}/> :
            null }
                { logicRows }
            </group>
            
            <group ref={analogRowsRef}>
            { (analogRows.length) ?
                <SrRowGroupSlider height={rowActionRef.current.analogHeight} color={'#31363b'} position={[-size.width/2+25, -rowActionRef.current.logicHeight/2-15, 2 ]} /> :
            null }
                { analogRows }
            </group>
            
            <group position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 1]} ref={linesGroupRef}>
                <group ref={logicLinesRef}>
                    { logicLines }
                </group>
                <group ref={analogLinesRef}>
                    { analogLines }
                </group>
            </group>
                
        </group>
    </>)
}

export default SrRowsPanel
