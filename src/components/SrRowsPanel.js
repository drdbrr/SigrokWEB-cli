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

const rowHeight = 50;

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
        <mesh   scale-y={height} ref={lineRef}>
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

//self._analog_channels.append({'name': item.name, 'text':item.name, 'color':colorsArray[i], 'visible':True, 'pVertDivs':1, 'nVertDivs':1, 'divHeight':50, 'vRes':20.0, 'autoranging':True, 'conversion':'', 'convThres':'', 'showTraces':'' })                

const SrAnalogChannelRow = ({i, text, rowRef, lineRef, rowActionRef, rowColor, pVertDivs, nVertDivs, divHeight, vRes, autoranging}) =>{
    console.log('SrAnalogChannelRow:', text);
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

const SrRowGroupSlider = ({color, position, height}) =>{
    const slRef = useRef();
    
    /*
    useEffect(()=>{
        const size = new THREE.Vector3()
        slRef.current.geometry.computeBoundingBox();
        slRef.current.geometry.boundingBox.getSize(size)
    }, []);
    */
    
    return(
        <mesh position={position} ref={slRef}>
            <planeBufferGeometry attach="geometry" args={[50, height]}/>
            <meshStandardMaterial color={color} roughness={1} />
        </mesh>
    )
}

const SrRowsPanel =({linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef/*, virtualCam*/})=>{
    console.log('Render SrRowsPannel');
    const { size, scene, camera, gl } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowActionRef = useRef({ index: null, down: false, moved:false, logicHeight:0, analogHeight:0, dHeight:0});
    
    const { logic, analog } = useReactiveVar(channelsVar);
    
    const decoders = [];
    
    const logicRowsRef = useRef();
    const logicLinesRef = useRef();
    
    const analogRowsRef = useRef();
    const analogLinesRef = useRef();
    
    
    //const [ channelsRows, channelsLines ] = useMemo(()=>{
    
    const order = useRef([]);
    
    //([{index:0, logicRowsRef:logicRowsRef, logicLinesRef:logicLinesRef}, {index:1, analogRowsRef:analogRowsRef, analogLinesRef:analogLinesRef }]);
    
    const [ logicRows, logicLines, analogRows, analogLines ] = useMemo(()=>{
        //const rows = [];
        //const lines = [];
        
        const logicRows = [];
        const logicLines = [];
        const analogRows = []
        const analogLines = []
        
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
            <SrLine
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
            <SrLine
                key={item.name + i + 'sra'}
                i={-i + logic.length}
                lineRef={item.lineRef}
                height={34}
            />);
        });
        
        order.current = [
            {index:0, rowsRef:logicRowsRef, linesRef:logicLinesRef, height:rowActionRef.current.logicHeight},
            {index:1, rowsRef:analogRowsRef, linesRef:analogLinesRef, height:rowActionRef.current.analogHeight}
        ];
        
        return [logicRows, logicLines, analogRows, analogLines]
    }, [logic, analog]);
    
    
    //const order = useRef([]);
    
    //useMemo(()=>logic.map((_, index) =>order.current.push(index)), [logic]);
    
    useFrame(()=>{
        rowActionRef.current.logicHeight = logic.reduce((total, obj) =>{
            if(obj.lineRef.current.visible)
                return parseInt(obj.lineRef.current.scale.y) + total + 15
        },0)
        
        rowActionRef.current.analogHeight = analog.reduce((total, obj) =>{
            if(obj.lineRef.current.visible)
                return parseInt(obj.pVertDivs + obj.nVertDivs) * obj.divHeight + total + 15
        },0)
        
        //let zm = 0;
        //analog.map((item)=>)
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
        
        //ATTENTION: calculates inner rows positions for logic group row
        if (!rowActionRef.current.down){
            let offset = 0;
            let offs = 0
            logic.map((item, i)=>{
                item.rowRef.current.position.y = offset;
                item.lineRef.current.position.y = offset ; 
                item.lineRef.current.position.y -= parseInt(item.lineRef.current.scale.y);
                item.rowRef.current.position.y -= parseInt(item.lineRef.current.scale.y)/2;
                if (item.lineRef.current.visible)
                    offset -= parseInt(item.lineRef.current.scale.y) + 8;
            });
            
            analog.map((item, i)=>{
                item.lineRef.current.position.y = offs;
                item.rowRef.current.position.y = offs;
                
                item.lineRef.current.position.y -= (item.pVertDivs + item.nVertDivs) * item.divHeight;
                item.rowRef.current.position.y -= (item.pVertDivs + item.nVertDivs) * item.divHeight/2;
                
                if (item.lineRef.current.visible)
                    offs -= parseInt(item.pVertDivs + item.nVertDivs) * item.divHeight + 8;
            })
            
            
        }
        
        if (!mouseRef.current.rmb || rowsGroupRef.current.position.y > size.height/2 - 50){
            rowsGroupRef.current.position.y = size.height/2 - 50
        }
        
        if (!rowActionRef.current.down){
            let aoffset = 0
            order.current.map((item, i)=>{
                aoffset -= order.current[i].height;
                item.rowsRef.current.position.y = aoffset + order.current[i].height;
                item.linesRef.current.position.y = aoffset + order.current[i].height;
                
                //item.rowsRef.current.position.y
                //item.linesRef.current.position.y
            })
        }
        
        
        //ATTENTION: calculates channels group rows positions
        /*
        if (!rowActionRef.current.down){
            let gg = 0;
            order.current.map((item, i, arr)=>{
                item.rowsRef.current.position.y =  gg;
                item.linesRef.current.position.y = gg;
                gg += item.height;
            });
        }
        */
        
        gl.autoClear = true
        gl.render(scene, camera)
    });
    
    console.log(()=>console.log(order.current), 5000);
    
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
