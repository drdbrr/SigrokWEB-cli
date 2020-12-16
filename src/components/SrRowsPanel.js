import * as THREE from 'three';
import React, { useRef, useMemo, memo, useEffect, useState, useCallback } from 'react';
import { useThree, useFrame/*, createPortal*/ } from 'react-three-fiber';
import { Text, Html } from '@react-three/drei';
import Roboto from '../fonts/Roboto.woff';

import { SrChannelPopUp } from './SrChannelPopUp';

//added 04/11/2020
import clamp from 'lodash-es/clamp';
import swap from 'lodash-move';

import { channelsVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

//const rowHeight = 50;

const vertexShader =`
    out vec3 pos;
    void main() {
        pos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const fragmentShader = `
    in vec3 pos;
    vec4 clr = vec4(0.0, 0.0, 0.0, 1.0);    
    void main() {
        if(pos.y == 1.0){
            clr = vec4(0.0, 1.0, 0.0, 1.0);
        }else if(pos.y == 0.0){
            clr = vec4(1.0, 0.0, 0.0, 1.0);
        }
        gl_FragColor = clr;
    }
`;

const SrLine = ({height, i, lineRef}) => {
    console.log("SR Line:", i);
    const positionY = i * (height + 15);
    const lineArray = [];
    for (let i = 0; i < 3000; i++){
        const val = Math.round(Math.random());
        lineArray.push(i, val, 0, i + 1, val, 0)
    }
    
    //const arLen = 300000;
    
    const lineData = new Float32Array(lineArray);//arLen);
    
    /*
    lineData.set(new Float32Array([0, 0, 0, (arLen / 3) * 50, 0, 0]), 0);
    useEffect(()=>{
        lineRef.current.children[0].geometry.setDrawRange(0, 0);
    });
    */
    
    const args = useMemo(() => {
        return({
            uniforms:{
                //color: { value: new THREE.Color( 0xffffff ) }
            },
            vertexShader,
            fragmentShader,
            //blending: THREE.AdditiveBlending,
            //depthTest: false,
            //transparent: true
        })
    },[]);
    
    return (
        <mesh position={[0, positionY-17, 0]}  scale-y={height} ref={lineRef}>
            <line>
                <bufferGeometry attach="geometry" >
                    <bufferAttribute
                        attachObject={['attributes', 'position']}
                        count={lineData.length / 3}
                        array={lineData}
                        itemSize={3}
                    />
                </bufferGeometry>
                <shaderMaterial attach="material" args={[args]} />
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
    
const SrChannelRow = ({ height, rowColor, i, text, rowRef, lineRef, rowActionRef })=>{
    console.log('SrChannelRow:', text);
    const [ popUp, setPopUp ] = useState(false);
    const positionY = (height + 15) * i;
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
        <group ref={rowRef} position={[0, positionY, 0]}>
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

const SrRowsPanel =({/*logic,*/ linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef/*, virtualCam*/})=>{
    console.log('Render SrRowsPannel');
    const { size, scene, camera, gl } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowActionRef = useRef({ index: null, down: false, moved:false});
    
    const virtualScene = useMemo(() => new THREE.Scene(), []);
    
    const { logic } = useReactiveVar(channelsVar);
    
    /*
    useEffect(() => {
        virtualCam.current.position.z = 200;
        virtualCam.current.left = -(size.width / 2);//!!!!!!!!!!!
        virtualCam.current.right = size.width / 2;//!!!!!!!!!
        virtualCam.current.top = size.height / 2;
        virtualCam.current.bottom = size.height / -2;
        virtualCam.current.updateProjectionMatrix();
    }, []);
    */
    
    const [ channelsRows, channelsLines ] = useMemo(()=>{
        const rows = [];
        const lines = [];
        logic.map((item, i)=>{
            rows.push(
            <SrChannelRow
                key={i}
                i={i}
                text={item.name}
                rowRef={item.rowRef}
                lineRef={item.lineRef}
                rowActionRef={rowActionRef}
                rowColor={item.color}
                height={item.traceHeight}
            />);
            
            lines.push(
            <SrLine
                key={i}
                i={i}
                lineRef={item.lineRef}
                height={item.traceHeight}
            />);
        });
        return [rows, lines]
    }, [logic]);
    
    const order = useRef([]);
    
    //useMemo(()=>logic.map((_, index) =>order.current.push(index)), [logic]);
    
    let prevRow = null;
    useFrame(()=>{
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
        else if (!rowActionRef.current.down && rowActionRef.current.index !== null){
            const pos = order.current.indexOf(rowActionRef.current.index) * rowHeight;
            const { lineRef, rowRef } = logic[rowActionRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 25;
            rowActionRef.current.index = null;
        }
        */
        
        gl.autoClear = true
        gl.render(scene, camera)
        /*
        gl.autoClear = false
        gl.clearDepth()
        gl.render(virtualScene, virtualCam.current)
        */
    });
    
    return(<>
        <mesh position={barPos} >
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
            <meshStandardMaterial color="#3c3c3c" roughness={0.75} metalness={0.3} />
        </mesh>
        <group ref={rowsGroupRef}>
            { channelsRows }
                <group position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 1]} ref={linesGroupRef}>{ channelsLines }</group>
        </group>
    </>)
}

export default SrRowsPanel
