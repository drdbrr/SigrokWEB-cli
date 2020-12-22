import React, { useMemo } from 'react';

//https://github.com/mrdoob/three.js/blob/dev/examples/webgl_custom_attributes_lines.html
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

export const SrLogicLine = ({height, i, lineRef}) => {
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
