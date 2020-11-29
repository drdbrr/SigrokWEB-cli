import * as THREE from 'three';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame, createPortal } from 'react-three-fiber';
import { Text, OrthographicCamera } from '@react-three/drei';

//added 04/11/2020
import clamp from 'lodash-es/clamp';
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
    
const SrChannelRow = ({ mouseRef, i, text, id, rowRef, lineRef, rowswapRef /*, rowsPanelPlaneWidth*/ })=>{
    console.log('SrChannelRow:', id);
    const positionY = rowHeight * i;
    const { size } = useThree();
    
    const down = useCallback((e) => {
        rowswapRef.current.index = i;
        rowswapRef.current.down = true;
        e.stopPropagation();
        e.target.setPointerCapture(e.pointerId);
    }, []);

    const up = useCallback((e) => {
        rowswapRef.current.down = false;
        e.stopPropagation();
        e.target.releasePointerCapture(e.pointerId);
    }, []);
    
    const move = useCallback((event) => {
        if (rowswapRef.current.down) {
            event.stopPropagation();
            mouseRef.current.dy += event.movementY;
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
                <planeBufferGeometry attach="geometry" args={[size.width , 1]}/>
                <meshBasicMaterial attach="material" transparent opacity={0.2}  color={colors[i]} />
            </mesh>
        </group>
    )
}

/*
const fn = (order, down, originalIndex, curIndex, y) => index =>
    down && index === originalIndex
        ? { y: curIndex * 100 + y }
        : { y: order.indexOf(index) * 100 }
*/

const SrRowsPanel =({logic, linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef, virtualCam})=>{
    console.log('Render SrRowsPannel');
    const { size, scene, camera, gl } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowswapRef = useRef({ index: null, down: false});
    
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
                rowswapRef={rowswapRef}
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
    
    useFrame(()=>{
        if (rowswapRef.current.down && rowswapRef.current.index !== null ){
            const {lineRef, rowRef} = logic[rowswapRef.current.index];
            lineRef.current.position.y = rowRef.current.position.y -= mouseRef.current.dy;
            lineRef.current.position.y -= 25;
            //rowRef.current.position.y += mouseRef.current.dy;
            //lineRef.current.position.y -= 25;
            /*
            const curRow = clamp(Math.round(rowRef.current.position.y / rowHeight), 0, logic.length - 1);
            if (curRow !== order.current.indexOf(rowswapRef.current.index)){
                const newOrder = swap(order.current, rowswapRef.current.index, curRow)
                order.current = newOrder;
                console.log('selected:', rowswapRef.current.index, ' ', 'curRow:', curRow, 'order.current:', order.current);
            }
            */
        }
        if (!rowswapRef.current.down && rowswapRef.current.index !== null){
            const pos = order.current.indexOf(rowswapRef.current.index) * rowHeight;
            const { lineRef, rowRef } = logic[rowswapRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 25;
            rowswapRef.current.index = null;
        }
        
        gl.autoClear = true
        gl.render(scene, camera)
        gl.autoClear = false
        gl.clearDepth()
        gl.render(virtualScene, virtualCam.current)
    });
    
    return(<>
        <mesh position={barPos} >
            <meshBasicMaterial attach="material" color="#2d3136"/>
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
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
