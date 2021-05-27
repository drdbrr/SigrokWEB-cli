import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import Roboto from '../fonts/Roboto.woff';

const Mark = ({mouseRef, pos, i, max, timeLineWidth, leftEdge, rightEdge, step, markElems}) =>{
    console.log('Render Mark');
    const markHeight = 6;
    const geo = new Float32Array([ 0, 0, 0, 0, markHeight + 3, 0 ]);
    const lowGeo = new Float32Array([ 0, 0, 0, 0, markHeight, 0 ]);
    
    const markRef = useRef();
    const txtRef = useRef();
    
    const elems = [];
    for (let i = 0; i < markElems - 1; i++){
        elems.push([(i + 1) * step, 0, 0])
    }
    
    useFrame(()=>{
        markRef.current.position.x -= mouseRef.current.dx;
        if(markRef.current.position.x > rightEdge){
            markRef.current.position.x -= timeLineWidth;
            txtRef.current.text = parseInt(txtRef.current.text) - max;
        }
        else if(markRef.current.position.x < leftEdge){
            markRef.current.position.x += timeLineWidth;
            txtRef.current.text = parseInt(txtRef.current.text) + max;
        }
    });
    
    return(
        <group position={[pos, 0, 0]} ref={markRef}>
            <line>
                <bufferGeometry attach="geometry" >
                    <bufferAttribute 
                        attachObject={['attributes', 'position']}
                        count={geo.length / 3}
                        array={geo}
                        itemSize={3}
                    />
                </bufferGeometry>
                <lineBasicMaterial attach="material" color="black"/>
            </line>
            <mesh position={[0,20,0]} >
                <Text
                    fontSize={12}
                    color='black'
                    ref={txtRef}
                    font={Roboto}
                >{i.toString()}</Text>
            </mesh>
            { elems.map((item, i)=>
                <line position={item} key={i}>
                    <bufferGeometry attach="geometry" >
                        <bufferAttribute 
                            attachObject={['attributes', 'position']}
                            count={lowGeo.length / 3}
                            array={lowGeo}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial attach="material" color="black"/>
                </line>
            ) }
        </group>
    )
}

const Marks = ({mouseRef, timeLinePlaneHeight}) =>{
    console.log("Render Marks");
    const { size } = useThree();
    const marks = [];
    const { zoom } = mouseRef.current;
    const step = (zoom % 2) ? 17 : 10;
    const markElems = (zoom % 2) ? 5 : 4;
    const markWidth = markElems  * step;
    const markNums = Math.ceil( (2000 / markWidth) / 5) * 5;
    const Txro = Math.ceil(mouseRef.current.cursor/markWidth);
    const Wo = (Txro * markWidth) - mouseRef.current.cursor;
    
    const timeLineWidth = markNums * markWidth;
    
    const leftEdge = -markWidth;
    const rightEdge = timeLineWidth - markWidth;
    
    let j = 0
    for(let i = Txro - 1; i < markNums + Txro - 1; i++ ){
        marks.push({ pos: leftEdge + (markWidth * j + Wo), txt: i});
        j++;
    }
    
    

    return(<group position={[(-size.width + 50)/2, -timeLinePlaneHeight/2, 0]} >
        { marks.map((item, i)=>
            <Mark
                max={marks.length}
                mouseRef={mouseRef}
                key={i + mouseRef.current.zoom.toString()}
                pos={item.pos}
                markElems={markElems}
                step={step}
                i={item.txt}
                leftEdge={leftEdge}
                rightEdge={rightEdge}
                timeLineWidth={timeLineWidth}
            />) }
    </group>)
}

const SrTimeLine =({cursorRef, mouseRef, timeLinePlaneWidth, timeLinePlaneHeight})=>{
    console.log("Render SrTimeLine");
    const { size } = useThree();
    //const cursorRef = useRef();
    const lineRef = useRef();
    
    const cursorGeometry = useMemo(() => {
        if (lineRef.current){
            lineRef.current.attributes.position.needsUpdate = true;
        }
        return new Float32Array([ 0, size.height/2-timeLinePlaneHeight, 0, 0, -size.height/2, 0 ])
    }, [size]);
    
    const barCrusor = new Float32Array([
        -6.0, 8.0,  0,
        0.0, 0.0,  0,
        6.0,  8.0,  0
    ]);
    
    //useFrame(()=>cursorRef.current.position.x = mouseRef.current.x - size.width/2);
    
    return(
        <>
            <group position={[(size.width - timeLinePlaneWidth)/2, (size.height - timeLinePlaneHeight)/2, 1]}>
                <mesh>
                    <meshBasicMaterial attach="material" color='white' />
                    <planeBufferGeometry attach="geometry" args={[ timeLinePlaneWidth  , timeLinePlaneHeight ]}/>
                </mesh>
                
                <Marks mouseRef={mouseRef} timeLinePlaneWidth={timeLinePlaneWidth} timeLinePlaneHeight={timeLinePlaneHeight}/>
                
            </group>
            
            <group ref={cursorRef}>
                <mesh position={[ 0, size.height/2-timeLinePlaneHeight, 1]} >
                    <bufferGeometry attach="geometry">
                        <bufferAttribute 
                            attachObject={['attributes', 'position']}
                            count={barCrusor.length / 3}
                            array={barCrusor}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <meshBasicMaterial attach="material" color="black" />
                </mesh>
                <line>
                    <bufferGeometry attach="geometry" ref={lineRef}>
                        <bufferAttribute
                            attachObject={['attributes', 'position']}
                            count={cursorGeometry.length / 3}
                            array={cursorGeometry}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial attach="material" color="#0dfc15"/>
                </line>
            </group>
        </>
    )
};

export default SrTimeLine;
