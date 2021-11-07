import React, { useEffect, useRef } from 'react';
import { SrApp } from '../components/SrApp';
import { selectedSessionVar, runStateVar, channelsVar, sidVar, cidVar } from '../ApolloClient';
import { useReactiveVar, useQuery, useMutation } from '@apollo/client';
import { GET_SESSION } from '../operations/queries/getSession';
//import { v4 as uuidv4 } from 'uuid';

const SrWs = ({ws, id}) =>{
    
    useEffect(() => {
        /*
        const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + id;
        window.history.pushState({ path: refresh }, '', refresh);
        */
        
        ws.current = new WebSocket('ws://' + window.location.hostname + ':3000/srsocket');
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({id:id, sid: sidVar()}));
            console.log('ws open', id);
        };
        ws.current.onclose = () =>{
            ws.current.send(JSON.stringify({cid: cidVar()}));
            console.log('WS CLOSE', cidVar());
        };
        ws.current.onmessage = (msg) => {
            const packet = JSON.parse(msg.data);
            console.log("WS RX:", packet);
            switch(Object.keys(packet)[0]){
                case 'data-analog':
                    const { analog } = channelsVar();
                    analog.map((item)=>{
                        const { data, pos, range } = packet.data.analog[item.name];
                        const mesh_data = new Float32Array( data );
                        item.lineRef.current.children[0].geometry.attributes.position.array.set(mesh_data, pos);
                        item.lineRef.current.children[0].geometry.setDrawRange(range[0], range[1]);
                        item.lineRef.current.children[0].geometry.attributes.position.needsUpdate = true;
                    });
                    break;
                    
                case 'data-logic':
                    const { logic } = channelsVar();
                    logic.map((item)=>{
                        const { data, pos, range } = packet.logic[item.name];
                        const mesh_data = new Float32Array( data );
                        item.lineRef.current.children[0].geometry.attributes.position.array.set(mesh_data, pos);
                        item.lineRef.current.children[0].geometry.setDrawRange(range[0], range[1]);
                        item.lineRef.current.children[0].geometry.attributes.position.needsUpdate = true;
                    });
                    break;
                    
                case 'config':
                    if ('run' in packet.config){
                        runStateVar(packet.config.run);
                    }
                    break;
            }
        };
        
        window.addEventListener("beforeunload", ()=>ws.current.send(JSON.stringify({cid: cidVar()})) );
        
        return () => {
            //ws.current.send(JSON.stringify({cid: cidVar()}));
            
            ws.current.close();
        }
    }, [id]);
    
    return null
}

export const App =()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('sid');
    const cid = urlParams.get('cid');
    sidVar(sid);
    selectedSessionVar(sid);
    cidVar(cid);
    
    const id = useReactiveVar(selectedSessionVar);
    const { data: { session } = {} } = useQuery(GET_SESSION, { onCompleted:()=>channelsVar({}), variables:{id:id}, skip: (!id)}); //ATTENTION to channelsVar
    
    const ws = useRef(null);
    return(<>
        <SrApp ws={ws} session={session ? session : {}} />
        { (id && session) ? <SrWs ws={ws} id={id} /> : null}
        </>
    )
}
