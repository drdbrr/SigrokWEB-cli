import * as THREE from 'three';
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from 'react-three-fiber';

const SrZeroLine = ({mouseRef}) =>{
    console.log('Render ZeroLine');
    const zeroRef = useRef();
    const points = [];
    points.push( new THREE.Vector3( 0, -1000, 0 ) );
    points.push( new THREE.Vector3( 0, 1000, 0 ) );
    const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const col = new THREE.Color(0xFF1465C0);
    
    const lineMaterial = new THREE.LineDashedMaterial( { color: col, linewidth: 2, dashSize: 10, gapSize: 10 } );
    
    //const [line] = useState(() => new  THREE.Line(lineGeometry, lineMaterial));
    
    const [line] = useState(() => new  THREE.Line(lineGeometry, lineMaterial));
    
    useEffect(()=>{
        line.computeLineDistances();
    }, []);
    
    useFrame(()=>{
        zeroRef.current.position.x -= mouseRef.current.dx;
    });
    
    return (
        <primitive dispose={undefined} object={line} ref={zeroRef} />
    )
} 

export default SrZeroLine;
