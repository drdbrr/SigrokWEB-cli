import React, { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { selectedSessionVar, channelsVar } from '../ApolloClient';
import { useReactiveVar, useApolloClient } from '@apollo/client';
import { SrLogicChannelsLines, SrAnalogChannelsLines } from './SrChannelsLines';
import { SrLogicChannelsRows, SrAnalogChannelsRows } from './SrRowsChannels';

import { useSetChannel } from '../operations/mutations/setChannel';

//import clamp from 'lodash-es/clamp';
//import get from 'lodash-es/get';
//import swap from 'lodash-move';

//const rowHeight = 50;

const SrRowsPanel =({linesGroupRef, rowsGroupRef, rowsPanelPlaneWidth, mouseRef})=>{
    console.log('Render SrRowsPannel');
    const { size } = useThree();
    const rowActionRef = useRef({ index: null, down: false, moved:false, logicHeight:0, analogHeight:0, dHeight:0, type:null});
    
    const id = useReactiveVar(selectedSessionVar);
    
    //ATTENTION
    const { mutate: setChannel } = useSetChannel(id);
    
    const order = useRef({});
    
    const channelGroups = useReactiveVar(channelsVar);
    
    const decoders = [];
    
    const logicRowsRef = useRef();
    const logicLinesRef = useRef();
    
    const analogRowsRef = useRef();
    const analogLinesRef = useRef();
    
    useFrame(()=>{
//-------------------        
        /*
        if (rowActionRef.current.down && rowActionRef.current.index !== null){
            const {lineRef, rowRef} = logic[rowActionRef.current.index];
            
            const curRow = clamp(Math.round(rowRef.current.position.y / rowHeight), 0, logic.length - 1);
    */
            
            /*
            if( curRow !== prevRow && prevRow !== null){
                
                const ind = order.current.indexOf(rowActionRef.current.index);
                
                order.current = newOrder;
                
                const ff = logic[order.current[ind]];
                const pp = ind * rowHeight;
                ff.lineRef.current.position.y = pp - 25;
                ff.rowRef.current.position.y = pp;
            }
            prevRow = curRow;
            */
        //}
        /*
        if (!rowActionRef.current.down && rowActionRef.current.index !== null){
            const pos = order.current.indexOf(rowActionRef.current.index) * -rowHeight;
            const { lineRef, rowRef } = logic[rowActionRef.current.index];
            rowRef.current.position.y = pos;
            lineRef.current.position.y = pos - 17;
            rowActionRef.current.index = null;
        }*/
//-------------------
/*
        if (!rowActionRef.curren.down){//ATTENTION
            let offset = 0
            Object.values(order.current).sort( (a,b)=> a.index - b.index ).map((item, i)=>{
                if (item.type !== rowActionRef.current.type){
                    item.rowRef.current.position.y = offset;
                    item.lineRef.current.position.y = offset;
                    offset -= item.height;
                }
            })
        }
  */      
        if (!mouseRef.current.rmb || rowsGroupRef.current.position.y > size.height/2 - 40)
            rowsGroupRef.current.position.y = size.height/2 - 40
    });
    
    return(<>
        <mesh position={[(rowsPanelPlaneWidth-size.width)/2, 0, 2]}>
            <planeBufferGeometry attach="geometry" args={[rowsPanelPlaneWidth, size.height]}/>
            <meshBasicMaterial color="#1F2833" />
        </mesh>
        <group ref={rowsGroupRef} position-y={size.height/2} >
            
            //ATTENTION rows
            { ('logic' in channelGroups)?
            <group ref={logicRowsRef} >
                <SrLogicChannelsRows setChannel={setChannel} logic={channelGroups.logic} logicRowsRef={logicRowsRef} logicLinesRef={logicLinesRef} rowActionRef={rowActionRef} order={order} />
            </group> : null }
            
            
            { ('analog' in channelGroups) ?
            <group ref={analogRowsRef}>
                <SrAnalogChannelsRows setChannel={setChannel} analog={channelGroups.analog} analogRowsRef={analogRowsRef} analogLinesRef={analogLinesRef} rowActionRef={rowActionRef} order={order} />
            </group> : null }
            
            //ATTENTION lines
            <group position={[-size.width / 2 + 50 + mouseRef.current.cursor, 0, 1]} ref={linesGroupRef}>
                { ('logic' in channelGroups) ?
                <group ref={logicLinesRef}>
                    <SrLogicChannelsLines logic={channelGroups.logic} />
                </group> : null }
                
                { ('analog' in channelGroups) ?
                <group ref={analogLinesRef}>
                    <SrAnalogChannelsLines analog={channelGroups.analog}/>
                </group> : null }
                
            </group>
                
        </group>
    </>)
}

export default SrRowsPanel
