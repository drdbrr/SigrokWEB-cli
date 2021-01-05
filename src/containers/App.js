import React, { useEffect, useRef } from 'react';
import { SrApp } from '../components/SrApp';
import { selectedSessionVar, sessionVar, channelsVar } from '../ApolloClient';
import { useReactiveVar, useQuery } from '@apollo/client';
import { GET_SESSION } from '../operations/queries/getSession';

const SrWs = ({ws, id, btnRef}) =>{
    
    useEffect(() => {
        ws.current = new WebSocket('ws://' + window.location.hostname + ':3000/srsocket');
        ws.current.onopen = () => {
            ws.current.send(JSON.stringify({id:id}));
            console.log('ws open', id);
        };
        ws.current.onmessage = (msg) => {
            const sample = JSON.parse(msg.data);
            console.log("ws RX data:", sample);
            if (sample.type == 'data'){
                /*
                chanRef.current.logic.map((item)=>{
                    const { data, pos, range } = sample.data[item.name];
                    const mesh_data = new Float32Array( data );
                    item.lineRef.current.attributes.position.array.set(mesh_data, pos);
                    item.lineRef.current.setDrawRange(range[0], range[1]);
                    item.lineRef.current.attributes.position.needsUpdate = true;
                });
                */
                console.log(sample.data);
            }
            else if (sample.type == 'config'){
                btnRef.current.startAcq(sample.sessionRun);
            }
        };
        return () => {
            ws.current.close();
        }
    }, []);
    
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
