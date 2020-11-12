import React, { memo, useRef, useCallback, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import SrTimeLine from './SrTimeLine';
import SrRowsPanel from './SrRowsPanel';
import SrZeroLine from './SrZeroLine';

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
    const { size } = useThree();
    const linesGroupRef = useRef();
    const rowsGroupRef = useRef();
    
    const mouseRef = useRef({ x: 0, y: 0, dx: 0, rmb: false, cursor:0, scale: 1 });
    
    /*
    setInterval(()=>{
        mouseRef.current.dx = -1;
        console.log(mouseRef.current.cursor);
    }, 100);
    */
    
    //scale props
    const zoomSpeed = 2;
    const minZoom = 0.00000000000001;
    const maxZoom = 1000; //Infinity
    const dollyScale =  Math.pow( 0.9, zoomSpeed );
    
    const [scale, setScale] = useState(2);
    const mouseScaleCallback = useCallback((event)=>{
        linesGroupRef.current.scale.x = mouseRef.current.scale;
        if ( event.deltaY > 0 ) {
            mouseRef.current.scale = Math.max( minZoom, Math.min( maxZoom, mouseRef.current.scale * dollyScale ) );
        } else if ( event.deltaY < 0 ) {
            mouseRef.current.scale = Math.max( minZoom, Math.min( maxZoom, mouseRef.current.scale / dollyScale ) );
        }
        setScale(mouseRef.current.scale);
        ws.current.send(JSON.stringify({scale: mouseRef.current.scale}));
    },[]);
    
    const prevRef = useRef(0);
    
    useFrame(()=>{
        mouseRef.current.dx = mouseRef.current.cursor - prevRef.current;
        prevRef.current = mouseRef.current.cursor;
    });

    const mouseMoveCallback = useCallback( (event)=>{
        mouseRef.current.x = event.clientX;
        mouseRef.current.y = event.clientY;
        
        if (mouseRef.current.rmb){
            mouseRef.current.cursor -= event.movementX;
            rowsGroupRef.current.position.y -= event.movementY;
            //linesGroupRef.current.position.x += event.movementX;
            ws.current.send(JSON.stringify( {x: -event.movementX} ));
        }
    }, []);
    
    const upCallback = useCallback((event)=>{
        if (event.button == 2 ){
            mouseRef.current.rmb = false;
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
    const mainPlaneGeo = [mainPlaneWidth, mainPlaneHeight, 0];
    
    return(<>
        <SrTimeLine mouseRef={mouseRef} scale={scale} timeLinePlaneWidth={size.width - rowsPanelPlaneWidth} timeLinePlaneHeight={timeLinePlaneHeight} />
        <SrRowsPanel logic={logic} linesGroupRef={linesGroupRef} rowsGroupRef={rowsGroupRef} rowsPanelPlaneWidth={rowsPanelPlaneWidth}/>
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
        
        <mesh position={[(-mainPlaneWidth + rowsPanelPlaneWidth)/2 - mouseRef.current.cursor, 0, 0]}>
            <SrZeroLine mouseRef={mouseRef}/>
        </mesh>
    </>)
    
}

export const SrCanvas = ({analog, logic, ws}) => {
    console.log('Render SrCanvas');
    const rmbCallback = useCallback((event)=>event.preventDefault(),[]);
    return(<>
        <Canvas
            orthographic
            style={{background:'purple'}}
            camera={{ zoom: 1 }}
            gl={{ antialias: false, logarithmicDepthBuffer: true }} //FXAA https://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/
            onContextMenu={rmbCallback}
        >
            <Layout analog={analog} logic={logic} ws={ws}/>
            {/*<Effect />*/}
        </Canvas>
    </>)
}
