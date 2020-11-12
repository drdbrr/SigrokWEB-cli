import * as THREE from 'three';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { Text } from '@react-three/drei';

//added 04/11/2020
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';
import { useGesture } from 'react-with-gesture';
import { useSprings, animated, interpolate, a } from 'react-spring';

//////////////////////////////////////////////
const colorsArray = ['#fce94f', '#edd400', '#c4a000', '#16191a', '#fcaf3e', '#f57900', '#ce5c00', '#2e3436', '#e9b96e', '#c17d11', '#8f5902', '#555753', '#8ae234', '#73d216', '#4e9a06', '#888a8f', '#729fcf', '#3465a4', '#204a87', '#babdb6', '#ad7fa8', '#75507b', '#5c3566', '#d3d7cf', '#cf72c3', '#a33496', '#87207a', '#eeeeec', '#ef2929', '#cc0000', '#a40000', '#ffffff'];

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array
}
const colors = shuffle(colorsArray);
//////////////////////////////////////////////

const rowHeight = 50;

const SrLine = memo(({i, lineRef}) => {
    console.log("SR Line:", i);
    const positionY = i * rowHeight;
    const arLen = 300000;
    const lineData = new Float32Array(arLen);
    lineData.set(new Float32Array([0, 0, 0, (arLen / 3) * 50, 0, 0]), 0);
    
    useEffect(()=>{
        lineRef.current.children[0].geometry.setDrawRange(0, 0);
    });
    
    return(
        <mesh position={[0, positionY,0]}/*scale-y={10}*/ ref={lineRef}>
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
})

const labelShape = new THREE.Shape();
    labelShape.moveTo(-14, 8);
    labelShape.lineTo(5,8);
    labelShape.lineTo(15,0);
    labelShape.lineTo(5,-8);
    labelShape.lineTo(-14,-8);
    
const labelGeometry = new THREE.ShapeBufferGeometry( labelShape );
    
const SrChannelRow = memo(({ i, text, id, rowRef, rowsPanelPlaneWidth })=>{
    console.log('SrChannelRow:', id);
    const positionY = rowHeight * i;
    const { size } = useThree();
    const mouseDownRef = useRef();
    
    const down = useCallback((e) => {
        mouseDownRef.current = true;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
    }, []);

    const up = useCallback((e) => {
        mouseDownRef.current = false;
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (mouseDownRef.current) {
            event.stopPropagation();
            rowRef.current.position.y -= event.movementY;
        }
    }, []);
    
    const over = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set('red');
    }, []);
    
    const out = useCallback(()=>{
        rowRef.current.children[0].children[1].material.color.set('blue');
    }, []);
    
    return(
        <group ref={rowRef} position={[0, positionY, 0]}>
            <group position={[-size.width/2+35, 0, 2]}>
                <mesh position={[-3, 0, 0]}>
                    <Text fontSize={12} >{text}</Text>
                </mesh>
                <mesh geometry={labelGeometry} onPointerUp={up} onPointerDown={down} onPointerMove={move} onPointerOut={out} onPointerOver={over} >
                    <meshBasicMaterial attach="material" color={'blue'/*colors[i]*/} />
                </mesh>
            </group>
            <mesh  scale={[1, 50, 1]}>
                <planeBufferGeometry attach="geometry" args={[size.width , 1, 3]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={colors[i]} />
            </mesh>
        </group>
    )
});


const fn = (order, down, originalIndex, curIndex, y) => index =>
    down && index === originalIndex
        ? { y: curIndex * 100 + y, scale: 1.1, zIndex: '1', shadow: 15, immediate: n => n === 'y' || n === 'zIndex' }
        : { y: order.indexOf(index) * 100, scale: 1, zIndex: '0', shadow: 1, immediate: false }

const SrRowsPanel =({logic, linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth})=>{
    console.log('Render SrRowsPannel');
    const { size } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
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
                rowsPanelPlaneWidth={rowsPanelPlaneWidth}
            />);
            
            lines.push(
            <SrLine
                key={i}
                i={i}
                lineRef={item.lineRef}
            />);
        });
        return [rows, lines]
    }, [logic]);
    
    const order = useRef(logic.map((_, index) => index));
    const [springs, setSprings] = useSprings(logic.length, fn(order.current));
    
    const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
        
        const curIndex = order.current.indexOf(originalIndex);
        
        const curRow = clamp(Math.round((curIndex * 100 + y) / 100), 0, items.length - 1);
        
        const newOrder = swap(order.current, curIndex, curRow);
        
        setSprings(fn(newOrder, down, originalIndex, curIndex, y));
        if (!down) order.current = newOrder;
    })
    
    return(<>
        <mesh position={barPos} >
            <meshBasicMaterial attach="material" color="#2d3136"/>
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height, 0]}/>
        </mesh>
        <group ref={rowsGroupRef}>
            { channelsRows }
            <group ref={linesGroupRef} >
                { channelsLines }
            </group>
        </group>
    </>)
}

export default SrRowsPanel
