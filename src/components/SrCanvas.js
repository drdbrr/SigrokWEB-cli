import React, { memo, useRef, useCallback, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame, extend } from 'react-three-fiber';
import SrTimeLine from './SrTimeLine';
import SrRowsPanel from './SrRowsPanel';
import SrZeroLine from './SrZeroLine';

import { SrLineOrthoCamera } from './SrLineOrthoCamera';

import { ApolloProvider } from '@apollo/client';
import { Client } from '../ApolloClient';

const Layout = ({ws}) =>{
    console.log('Render Layout');
    const { size, camera } = useThree();
    const linesGroupRef = useRef();
    const rowsGroupRef = useRef();
    const cursorRef = useRef();
    const zeroRef = useRef();
    
    //const virtualCam = useRef(new SrLineOrthoCamera(0, 0, 0, 0, 0.1, 1000));
    
    //virtualCam.current.zoom = 1;
    
    const mouseRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, rmb: false, cursor:0, cursorY:0, /*scaleX: 1,*/ scaleY:50, zoom:1, offset:0, deltaX:0, scale:0.001 });
    
    /*
    setInterval(()=>{
        mouseRef.current.dx = -1;
        console.log(mouseRef.current.cursor);
    }, 100);
    */
    
    //scale props
    const zoomSpeed = 2;
    const minZoom = 0.0000000001;
    const maxZoom = 10000; //Infinity
    
    const dollyScale =  Math.pow( 0.9, zoomSpeed );
    
    const mouseScaleCallback = useCallback( (event)=>{
        let newScale = null;
        if ( event.deltaY > 0 ) {
            newScale = Math.max(Math.min(linesGroupRef.current.scale.x * Math.pow(3/2, 1), maxZoom), minZoom);
        } else { // if ( event.deltaY < 0 ) {
            newScale = Math.max(Math.min(linesGroupRef.current.scale.x * Math.pow(3/2, -1), maxZoom), minZoom);
        }
        
        const deltaScale = newScale - linesGroupRef.current.scale.x;
        const deltaX = deltaScale * mouseRef.current.x;
        
        linesGroupRef.current.position.x -= deltaX;
        zeroRef.current.position.x -= deltaX;
        mouseRef.current.cursor += deltaX;        
        linesGroupRef.current.scale.x = newScale;

        /*
        let ns = null;
        if ( event.deltaY > 0 ) {
            ns = Math.max( minZoom, Math.min( maxZoom, linesGroupRef.current.scale.x * dollyScale ) );
        } else { // if ( event.deltaY < 0 ) {
            ns = Math.max( minZoom, Math.min( maxZoom, linesGroupRef.current.scale.x / dollyScale ) );
        }
        
        const ds = linesGroupRef.current.scale.x - ns;
        const dsx = mouseRef.current.x * ds;
         
        linesGroupRef.current.position.x += dsx;
        zeroRef.current.position.x += dsx;
        mouseRef.current.cursor -= dsx;
        linesGroupRef.current.scale.x = ns;
        */
        
        //virtualCam.current.zoom = zoom;
        //virtualCam.current.updateProjectionMatrix();
    },[]);
    
    const prevRef = useRef([0, 0]);
    
    //const testRef =useRef();
    
    useFrame(()=>{
        mouseRef.current.dx = mouseRef.current.cursor - prevRef.current[0];
        mouseRef.current.dy = mouseRef.current.cursorY - prevRef.current[1];
        prevRef.current[0] = mouseRef.current.cursor;
        prevRef.current[1] = mouseRef.current.cursorY;
    });

    const mouseMoveCallback = useCallback( (event)=>{
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
        
        cursorRef.current.position.x = event.clientX - size.width/2;
        
        if (mouseRef.current.rmb){
            mouseRef.current.cursor -= event.movementX;
            
            /*
            const arr = [
                30,-60,0,
                30,60,0,
                event.clientX,-60,0,
                event.clientX,60,0
            ];
            const geom = new Float32Array(arr);
        
            testRef.current.geometry.attributes.position.array = geom;
            testRef.current.geometry.attributes.position.needsUpdate = true
            */
            
            //(event.movementX > 0 /*&& event.movementX !== 0*/) ? mouseRef.current.deltaX++ : mouseRef.current.deltaX--;
            //mouseRef.current.deltaX += event.movementX;
            
            rowsGroupRef.current.position.y -= event.movementY;
            linesGroupRef.current.position.x += event.movementX;
            
            zeroRef.current.position.x += event.movementX;
            ws.current.send(JSON.stringify( {x: -event.movementX} ));
        }
    }, []);
    
    const upCallback = useCallback((event)=>{
        if (event.button == 2 ){
            mouseRef.current.rmb = false;
            //mouseRef.current.offset -= linesGroupRef.current.scale.x * mouseRef.current.deltaX;
            //mouseRef.current.deltaX = 0;
        }
    },[]);
    
    const downCallback = useCallback((event)=>{
        if (event.button == 2 ){
            mouseRef.current.rmb = true;
        }
    },[]);
    
    const rmbCallback = useCallback((event)=>event.preventDefault(),[]);
    
    const timeLinePlaneHeight = 30;
    const rowsPanelPlaneWidth = 50;

    const mainPlaneWidth = size.width - rowsPanelPlaneWidth;
    const mainPlaneHeight = size.height - timeLinePlaneHeight;
    //const mainPlanePos = [(mainPlaneWidth - size.width)/2 + rowsPanelPlaneWidth, ( size.height - mainPlaneHeight )/2 - timeLinePlaneHeight, 0];
    const mainPlanePos = [0 + rowsPanelPlaneWidth/2, 0 - timeLinePlaneHeight/2, 0];
    const mainPlaneGeo = [mainPlaneWidth, mainPlaneHeight];
    
    return(<>
        {/*
        <mesh position={[0,0,0]} ref={testRef}>
            <meshBasicMaterial attach="material" color="white"/>
            <planeBufferGeometry attach="geometry" args={[300,300]}/>
        </mesh>
        */}
        <SrTimeLine cursorRef={cursorRef} mouseRef={mouseRef} timeLinePlaneWidth={size.width - rowsPanelPlaneWidth} timeLinePlaneHeight={timeLinePlaneHeight} />
        <mesh
            position={mainPlanePos}
            onPointerMove={mouseMoveCallback}
            onPointerDown={downCallback}
            onPointerUp={upCallback}
            onWheel={mouseScaleCallback}
        >
            <meshBasicMaterial attach="material" color="#2a2a2a" transparent opacity={0.0}/>
            <planeBufferGeometry attach="geometry" args={mainPlaneGeo}/>
        </mesh>
        
        <SrRowsPanel  mouseRef={mouseRef} linesGroupRef={linesGroupRef} rowsGroupRef={rowsGroupRef} rowsPanelPlaneWidth={rowsPanelPlaneWidth}/>

        <mesh position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 0]}>
            <SrZeroLine zeroRef={zeroRef}/>
        </mesh>
        
    </>
    )
}


function Lights() {
  return (
    <group>
      <ambientLight intensity={1} />
      <spotLight
        castShadow
        intensity={0.2}
        angle={Math.PI / 7}
        position={[150, 150, 250]}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  )
}

export const SrCanvas = memo(({ws}) => {
    console.log('Render SrCanvas');
    const rmbCallback = useCallback((event)=>event.preventDefault(),[]);
    return(<>
        <Canvas
            orthographic
            style={{background:'#2a2a2a'}}
            gl={{ antialias: false, logarithmicDepthBuffer: true }} //FXAA https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
            onContextMenu={rmbCallback}
        >
            <Lights />
            <ApolloProvider client={Client}>
                <Layout ws={ws}/>
            </ApolloProvider>
        </Canvas>
    </>)
})
