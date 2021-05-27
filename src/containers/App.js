import React, { useEffect, useRef, useMemo } from 'react';
import { SrApp } from '../components/SrApp';
import { selectedSessionVar, sessionVar, channelsVar, runStateVar } from '../ApolloClient';
import { useReactiveVar, useQuery } from '@apollo/client';
import { GET_SESSION } from '../operations/queries/getSession';

const SrWs = ({ws, id, btnRef}) =>{
    
    useEffect(() => {
        const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + id;
        window.history.pushState({ path: refresh }, '', refresh);
        
        ws.current = new WebSocket('ws://' + window.location.hostname + ':3000/srsocket');
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({id:id}));
            console.log('ws open', id);
        };
        ws.current.onmessage = (msg) => {
            const packet = JSON.parse(msg.data);
            console.log('RX:', packet);
            switch(packet.type){
                case 'data':
                    const { logic, analog } = channelsVar();
                    
                    /*
                    logic.map((item)=>{
                        const { data, pos, range } = packet.logic[item.name];
                        const mesh_data = new Float32Array( data );
                        item.lineRef.current.children[0].geometry.attributes.position.array.set(mesh_data, pos);
                        item.lineRef.current.children[0].geometry.setDrawRange(range[0], range[1]);
                        item.lineRef.current.children[0].geometry.attributes.position.needsUpdate = true;
                    });
                    */
                    
                    analog.map((item)=>{
                        const { data, pos, range } = packet.data.analog[item.name];
                        const mesh_data = new Float32Array( data );
                        item.lineRef.current.children[0].geometry.attributes.position.array.set(mesh_data, pos);
                        item.lineRef.current.children[0].geometry.setDrawRange(range[0], range[1]);
                        item.lineRef.current.children[0].geometry.attributes.position.needsUpdate = true;
                    });
                    
                    break;
                case 'config':
                    if ('sessionRun' in packet)
                        runStateVar(Boolean(packet.sessionRun));
                    if ('channel' in packet){
                        //const chg = channelsVar();
                        
                        const chg = {...channelsVar()};
                        
                        Object.values(chg).forEach(group =>{
                            const ch = group.find(ch => ch.name === packet.channel.name);
                            if (ch)
                                ch.visible = packet.channel.enable;
                        });
                        channelsVar(chg);
                        console.log(channelsVar());
                    }
                    break;
            }
        };
        return () => {
            ws.current.close();
        }
    }, [id]);
    
    return null
}

export const App =()=>{
    const id = useReactiveVar(selectedSessionVar);
    
    const { data: { session } = {} } = useQuery(GET_SESSION, { variables:{id: id}, skip: (!id), onCompleted:(session)=>{
        //sessionVar(session);
        channelsVar({logic:[], analog:[]});
    } });
    
    const btnRef = useRef();
    const ws = useRef(null);
    
    return(<>
        <SrApp btnRef={btnRef} ws={ws} session={session ? session : {}}/>
        { (id) ? <SrWs ws={ws} btnRef={btnRef} id={id}/> : null}
        </>
    )
}
