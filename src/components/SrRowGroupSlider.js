import React, { useRef } from 'react';

export const SrRowGroupSlider = ({height, color, position})=>{
    const slRef = useRef();
    /*
    useEffect(()=>{
        const size = new THREE.Vector3()
        slRef.current.geometry.computeBoundingBox();
        slRef.current.geometry.boundingBox.getSize(size)
    }, []);
    */
    return(
        <mesh position={position} ref={slRef} >
            <planeBufferGeometry attach="geometry" args={[50, height]}/>
            <meshStandardMaterial color={color} roughness={1} />
        </mesh>
    )
}
