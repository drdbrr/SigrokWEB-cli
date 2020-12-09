import { extend } from 'react-three-fiber';
import glsl from 'babel-plugin-glsl/macro';
import { shaderMaterial } from "drei";

const srShaderMaterial = shaderMaterial(
    { amplitude: 5.0,
    opacity: 0.3,
    color: new THREE.Color( 0xffffff )
    },
    //{ time: 0, color: new THREE.Color(0.2, 0.0, 0.1) },
    // vertex shader
    glsl`
    uniform float amplitude;
    
    attribute vec3 displacement;
    attribute vec3 customColor;
    
    varying vec3 vColor;

    void main() {
        vec3 newPosition = position + amplitude * displacement;
        vColor = customColor;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }`,
    // fragment shader
    glsl`
    uniform vec3 color;
    uniform float opacity;
    
    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4( vColor * color, opacity );
    }`
)

export default extend({ srShaderMaterial }) //< mesh > <colorShiftMaterial attach="material" color="hotpink"/> 
