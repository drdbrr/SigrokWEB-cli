import * as THREE from 'three';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame, createPortal } from 'react-three-fiber';
import { Text, Html } from '@react-three/drei';

import SrChannelPopUp from './SrChannelPopUp';

//added 04/11/2020
import clamp from 'lodash-es/clamp';

//import  difference from 'lodash-es/difference';
import swap from 'lodash-move';
//import { useGesture } from 'react-with-gesture';
//import { useSprings, animated, interpolate, a } from 'react-spring';

//////////////////////////////////////////////
const colorsArray = ['#fce94f', '#edd400', '#c4a000', '#16191a', '#fcaf3e', '#f57900', '#ce5c00', '#2e3436', '#e9b96e', '#c17d11', '#8f5902', '#555753', '#8ae234', '#73d216', '#4e9a06', '#888a8f', '#729fcf', '#3465a4', '#204a87', '#babdb6', '#ad7fa8', '#75507b', '#5c3566', '#d3d7cf', '#cf72c3', '#a33496', '#87207a', '#eeeeec', '#ef2929', '#cc0000', '#a40000', '#ffffff'];



function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array
}
const colors = shuffle(colorsArray);
//////////////////////////////////////////////

const rowHeight = 50;

const SrLine = ({i, lineRef}) => {
    console.log("SR Line:", i);
    const positionY = i * rowHeight;
    const data = [];
    for (let i = 0; i < 3000; i++){
        const val = Math.round(Math.random());
        data.push(i, val, 0, i + 1, val, 0)
    }
    
    const arLen = 300000;
    
    const lineData = new Float32Array(data);//arLen);
    
    /*
    lineData.set(new Float32Array([0, 0, 0, (arLen / 3) * 50, 0, 0]), 0);
    useEffect(()=>{
        lineRef.current.children[0].geometry.setDrawRange(0, 0);
    });
    */
    
    return (
        <mesh position={[0, positionY - 25, 0]} scale-x={1} scale-y={50} ref={lineRef}>
            <line>
                <bufferGeometry attach="geometry" >
                    <bufferAttribute
                        attachObject={['attributes', 'position']}
                        count={lineData.length / 3}
                        array={lineData}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color="red"/>
            </line>
        </mesh>
    )
}

const labelShape = new THREE.Shape();
    labelShape.moveTo(-14, 8);
    labelShape.lineTo(5,8);
    labelShape.lineTo(15,0);
    labelShape.lineTo(5,-8);
    labelShape.lineTo(-14,-8);
    
const labelGeometry = new THREE.ShapeBufferGeometry( labelShape );

function rgbToYIQ({ r, g, b }){
    return ((r * 299) + (g * 587) + (b * 114)) / 1000;
}

function contrast(colorHex){
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);

        const r = parseInt(result[1], 16)
        const g = parseInt(result[2], 16)
        const b = parseInt(result[3], 16)
    
    const color = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    return color >= 128 ? '#000' : '#fff';
}

    
const SrChannelRow = ({ mouseRef, i, text, id, rowRef, lineRef, rowActRef /*, rowsPanelPlaneWidth*/ })=>{
    console.log('SrChannelRow:', id);
    const [ popUp, setPopUp ] = useState(false);
    const positionY = rowHeight * i;
    const { size } = useThree();
    
    const rowColor = new THREE.Color(colors[i]);
    
    const textColor = contrast(colors[i]);
    
    const down = useCallback((e) => {
        rowActRef.current.index = i;
        rowActRef.current.down = true;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
    }, []);

    const up = useCallback((e) => {
        
        if (!rowActRef.current.moved)
            setPopUp(true);
        
        rowActRef.current.moved = false;
        rowActRef.current.down = false;
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (rowActRef.current.down) {
            rowActRef.current.moved = true;
            event.stopPropagation();
            mouseRef.current.dy += event.movementY;
        }
    }, []);
    
    const over = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set('red');
    }, []);
    
    const out = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set(rowColor);
    }, []);
    
    
    
    return(
        <group ref={rowRef} position={[0, positionY, 0]}>
            <group position={[-size.width/2+35, 0, 2]}>
                <mesh position={[-3, 0, 0]}>
                    <Text fontSize={12} color={textColor}>{text}</Text>
                </mesh>
                <mesh geometry={labelGeometry} onPointerUp={up} onPointerDown={down} onPointerMove={move} onPointerOut={out} onPointerOver={over} >
                    <meshStandardMaterial color={rowColor} />
                </mesh>
                
                <SrChannelPopUp open={popUp} setOpen={setPopUp} />

            </group>
            <mesh  scale={[1, 50, 1]}>
                <planeBufferGeometry attach="geometry" args={[size.width , 1]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={rowColor} />
            </mesh>
        </group>
    )
}

const SrRowsPanel =({logic, linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef, virtualCam})=>{
    console.log('Render SrRowsPannel');
    const { size, scene, camera, gl } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowActRef = useRef({ index: null, down: false, moved:false});
    
    const virtualScene = useMemo(() => new THREE.Scene(), []);
    
    useEffect(() => {
        virtualCam.current.position.z = 200;
        virtualCam.current.left = -(size.width / 2);//!!!!!!!!!!!
        virtualCam.current.right = size.width / 2;//!!!!!!!!!
        virtualCam.current.top = size.height / 2;
        virtualCam.current.bottom = size.height / -2;
        virtualCam.current.updateProjectionMatrix();
    }, []);
    
    const [ channelsRows, channelsLines ] = useMemo(()=>{
        const rows = [];
        const lines = [];
        logic.map((item, i)=>{
            rows.push(
            <SrChannelRow
                key={i}
                i={i}
                text={item.name}
                id={item.name}
                rowRef={item.rowRef}
                lineRef={item.lineRef}
                rowActRef={rowActRef}
                rowsPanelPlaneWidth={rowsPanelPlaneWidth}
                mouseRef={mouseRef}
            />);
            
            lines.push(
            <SrLine
                key={i}
                i={i}
                lineRef={item.lineRef}
                mouseRef={mouseRef}
            />);
        });
        return [rows, lines]
    }, [logic]);
    
    const order = useRef([]);
    useMemo(()=>logic.map((_, index) =>order.current.push(index)), [logic]);
    
    let prevRow = null;
    useFrame(()=>{
        if (rowActRef.current.down && rowActRef.current.index !== null && mouseRef.current.dy ){
            const {lineRef, rowRef} = logic[rowActRef.current.index];
            lineRef.current.position.y = rowRef.current.position.y -= mouseRef.current.dy;
            lineRef.current.position.y -= 25;
            
            const curRow = clamp(Math.round(rowRef.current.position.y / rowHeight), 0, logic.length - 1);
            
            if( curRow !== prevRow && prevRow !== null){
                
                const newOrder = swap(order.current, rowActRef.current.index, curRow);
                
                const ind = order.current.indexOf(rowActRef.current.index);
                
                order.current = newOrder;
                
                const ff = logic[order.current[ind]];
                const pp = ind * rowHeight;
                ff.lineRef.current.position.y = pp - 25;
                ff.rowRef.current.position.y = pp;
            }
            prevRow = curRow;
        }
        else if (!rowActRef.current.down && rowActRef.current.index !== null){
            const pos = order.current.indexOf(rowActRef.current.index) * rowHeight;
            const { lineRef, rowRef } = logic[rowActRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 25;
            rowActRef.current.index = null;
        }
        
        gl.autoClear = true
        gl.render(scene, camera)
        gl.autoClear = false
        gl.clearDepth()
        gl.render(virtualScene, virtualCam.current)
    });
    
    const color2 = new THREE.Color( "hsl(0, 0%, 24%)" );
    
    return(<>
        <mesh position={barPos} >
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
            <meshStandardMaterial color="#3c3c3c" roughness={0.75} metalness={0.3} />
        </mesh>
        <group ref={rowsGroupRef}>
            { channelsRows }
            { createPortal(
                <group position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 1]} ref={linesGroupRef}>{ channelsLines }</group>
            , virtualScene) }
        </group>
    </>)
}

export default SrRowsPanel
