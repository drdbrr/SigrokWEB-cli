import { Vector3, BufferGeometry, LineDashedMaterial, Line } from 'three';
import React, { useEffect, useState } from 'react';

const DashedLine = ({posY}) =>{
    const points = [];
    points.push( new Vector3( -1000, 0, 0 ) );
    points.push( new Vector3( 1000, 0, 0 ) );

    const lineGeometry = new BufferGeometry().setFromPoints( points );
    const lineMaterial = new LineDashedMaterial( { color: 'black', linewidth: 1, dashSize: 3, gapSize: 4 } );
    const [line] = useState(() => new Line(lineGeometry, lineMaterial));

    useEffect(()=>line.computeLineDistances(), []);
    
    return (
        <primitive position-y={posY} dispose={undefined} object={line} />
    )
} 

export default DashedLine;
 
