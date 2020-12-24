import React, { useRef } from 'react';
import { useThree, useFrame } from 'react-three-fiber';
import { channelsVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';
import { SrLogicChannelsLines, SrAnalogChannelsLines } from './SrChannelsLines';
import { SrLogicChannelsRows, SrAnalogChannelsRows } from './SrRowsChannels';

//import clamp from 'lodash-es/clamp';
//import get from 'lodash-es/get';
//import swap from 'lodash-move';

//const rowHeight = 50;

const SrRowsPanel =({linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef})=>{
    console.log('Render SrRowsPannel');
    const { size } = useThree();
    const barPos = [ (rowsPanelPlaneWidth-size.width)/2, 0, 2];
    const rowActionRef = useRef({ index: null, down: false, moved:false, logicHeight:0, analogHeight:0, dHeight:0});
    
    const { logic, analog } = useReactiveVar(channelsVar);
    
    const decoders = [];
    
    const logicRowsRef = useRef();
    const logicLinesRef = useRef();
    
    const analogRowsRef = useRef();
    const analogLinesRef = useRef();
    
    const order = useRef({
            logic:{index:0, rowRef:logicRowsRef, lineRef:logicLinesRef, height:rowActionRef.current.logicHeight},
            analog:{index:1, rowRef:analogRowsRef, lineRef:analogLinesRef, height:rowActionRef.current.analogHeight}
        });
    
    //const order = useRef([]);
    //useMemo(()=>logic.map((_, index) =>order.current.push(index)), [logic]);
    
    //let prevRow = null;
    useFrame(()=>{
//-------------------        
        /*
        if (rowActionRef.current.down && rowActionRef.current.index !== null && mouseRef.current.dy ){
            const {lineRef, rowRef} = logic[rowActionRef.current.index];
            lineRef.current.position.y = rowRef.current.position.y -= mouseRef.current.dy;
            lineRef.current.position.y -= 25;
            
            const curRow = clamp(Math.round(rowRef.current.position.y / rowHeight), 0, logic.length - 1);
            
            if( curRow !== prevRow && prevRow !== null){
                
                const newOrder = swap(order.current, rowActionRef.current.index, curRow);
                
                const ind = order.current.indexOf(rowActionRef.current.index);
                
                order.current = newOrder;
                
                const ff = logic[order.current[ind]];
                const pp = ind * rowHeight;
                ff.lineRef.current.position.y = pp - 25;
                ff.rowRef.current.position.y = pp;
            }
            prevRow = curRow;
        }
        if (!rowActionRef.current.down && rowActionRef.current.index !== null){
            const pos = order.current.indexOf(rowActionRef.current.index) * -rowHeight;
            const { lineRef, rowRef } = logic[rowActionRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 17;
            rowActionRef.current.index = null;
        }*/
//-------------------        
        if (!rowActionRef.current.down){
            let offset = 0
            Object.values(order.current).map((item, i)=>{
                item.rowRef.current.position.y = offset;
                item.lineRef.current.position.y = offset;
                offset -= item.height;
            })
        }
        
        if (!mouseRef.current.rmb || rowsGroupRef.current.position.y > size.height/2 - 40)
            rowsGroupRef.current.position.y = size.height/2 - 40
    });
    
    return(<>
        <mesh position={barPos} >
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
            <meshStandardMaterial color="#3c3c3c" roughness={0.75} metalness={0.3} />
        </mesh>
        <group ref={rowsGroupRef} position-y={size.height/2} >
            
            //ATTENTION rows
            <group ref={logicRowsRef}>
                <SrLogicChannelsRows rowActionRef={rowActionRef} order={order} />
            </group>
            
            <group ref={analogRowsRef}>
                <SrAnalogChannelsRows rowActionRef={rowActionRef} order={order} />
            </group>
            
            //ATTENTION lines
            <group position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 1]} ref={linesGroupRef}>
                <group ref={logicLinesRef}>
                    <SrLogicChannelsLines />
                </group>
                <group ref={analogLinesRef}>
                    <SrAnalogChannelsLines />
                </group>
            </group>
                
        </group>
    </>)
}

export default SrRowsPanel
