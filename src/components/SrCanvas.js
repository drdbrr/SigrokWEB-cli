import React, { memo, useRef, useCallback, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import SrTimeLine from './SrTimeLine';
import SrRowsPanel from './SrRowsPanel';
import SrZeroLine from './SrZeroLine';

import { SrLineOrthoCamera } from './SrLineOrthoCamera';

/*
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';

function Effect() {
    const { gl, scene, camera, size } = useThree()
    const final = useMemo(() => {
        const renderScene = new RenderPass(scene, camera)
        const finalComposer = new EffectComposer(gl)
        finalComposer.addPass(renderScene)
        const fxaa = new ShaderPass(FXAAShader)
        fxaa.material.uniforms['resolution'].value.x = 1 / size.width
        fxaa.material.uniforms['resolution'].value.y = 1 / size.height
        finalComposer.addPass(fxaa)
        return finalComposer
    }, [gl, scene, camera, size.width, size.height])

    useEffect(() => {
        final.setSize(size.width, size.height)
    }, [final, size]);
    
    useFrame(() => {
        final.render()
    }, 10)
    return null
}
*/

const Layout = ({analog, logic, ws}) =>{
    console.log('Render Layout');
    const { size, camera } = useThree();
    const linesGroupRef = useRef();
    const rowsGroupRef = useRef();
    const cursorRef = useRef();
    const zeroRef = useRef();
    
    const virtualCam = useRef(new SrLineOrthoCamera(0, 0, 0, 0, 0.1, 1000));
    
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
            
            //(event.movementX > 0 /*&& event.movementX !== 0*/) ? mouseRef.current.deltaX++ : mouseRef.current.deltaX--;
            //mouseRef.current.deltaX += event.movementX;
            
            linesGroupRef.current.position.y = rowsGroupRef.current.position.y -= event.movementY;
            //linesGroupRef.current.position.x += event.movementX / virtualCam.current.zoom; //WARNING
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
    
        <SrTimeLine cursorRef={cursorRef} mouseRef={mouseRef} timeLinePlaneWidth={size.width - rowsPanelPlaneWidth} timeLinePlaneHeight={timeLinePlaneHeight} />
        <SrRowsPanel virtualCam={virtualCam} mouseRef={mouseRef} logic={logic} linesGroupRef={linesGroupRef} rowsGroupRef={rowsGroupRef} rowsPanelPlaneWidth={rowsPanelPlaneWidth}/>
        <mesh
            position={mainPlanePos}
            onPointerMove={mouseMoveCallback}
            onPointerDown={downCallback}
            onPointerUp={upCallback}
            onWheel={mouseScaleCallback}
        >
            <meshBasicMaterial attach="material" color="#575757"/>
            <planeBufferGeometry attach="geometry" args={mainPlaneGeo}/>
        </mesh>


        <mesh position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 0]}>
            <SrZeroLine zeroRef={zeroRef}/>
        </mesh>
        
    </>
    )
}

export const SrCanvas = memo(({analog, logic, ws}) => {
    console.log('Render SrCanvas');
    const rmbCallback = useCallback((event)=>event.preventDefault(),[]);
    return(<>
        <Canvas
            orthographic
            style={{background:'purple'}}
            gl={{ antialias: false, logarithmicDepthBuffer: true }} //FXAA https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
            onContextMenu={rmbCallback}
        >
            <Layout analog={analog} logic={logic} ws={ws}/>
            {/*<Effect />*/}
        </Canvas>
    </>)
})
