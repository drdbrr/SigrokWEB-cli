import { Vector3, BufferGeometry, LineDashedMaterial, Line } from 'three';
import React, { useEffect, useState } from 'react';

const SrZeroLine = ({zeroRef}) =>{
    console.log('Render ZeroLine');
    const points = [];
    points.push( new Vector3( 0, -1000, 0 ) );
    points.push( new Vector3( 0, 1000, 0 ) );

    const lineGeometry = new BufferGeometry().setFromPoints( points );
    const lineMaterial = new LineDashedMaterial( { color: 0xFF1465C0, linewidth: 2, dashSize: 10, gapSize: 10 } );
    const [line] = useState(() => new Line(lineGeometry, lineMaterial));

    useEffect(()=>line.computeLineDistances(), []);
    
    return (
        <primitive dispose={undefined} object={line} ref={zeroRef} />
    )
} 

export default SrZeroLine;
