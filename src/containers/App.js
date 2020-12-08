import React, { useEffect, useRef, useMemo, createRef } from 'react';
//import { useQuery } from '@apollo/client';
//import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, blueTheme, redTheme } from '../styled/Themes';
import { SrApp } from '../components/SrApp';

import { selectedSessionVar } from '../ApolloClient';
import { useReactiveVar, useQuery } from '@apollo/client';
import { GET_SESSION } from '../operations/queries/getSession';

export const App =()=>{
    const id = useReactiveVar(selectedSessionVar);    
    const session = useQuery(GET_SESSION, { variables:{id: id}, skip: (!id) });
    
    const [ analog, logic ] = useMemo(()=>{
        const analog = [];
        const logic = [];
        if (session.data){
            if(session.data.session.logic.length){
                session.data.session.logic.map((item)=>logic.push({name:item.name, rowRef:createRef(), lineRef:createRef()}));
            }
        }
        return [ analog, logic ];
    }, [session.data]);
    
    const ws = useRef(null);
    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:3000/srsocket');
        ws.current.onopen = () => {
            //ws.current.send(JSON.stringify({srpid:srpid}));
            console.log('ws open',);
        };
        ws.current.onmessage = (msg) => {
            const sample = JSON.parse(msg.data);
            //console.log("ws RX data:", sample);
            /*
            if (sample.type == 'data'){
                chanRef.current.logic.map((item)=>{
                    const { data, pos, range } = sample.data[item.name];
                    const mesh_data = new Float32Array( data );
                    item.lineRef.current.attributes.position.array.set(mesh_data, pos);
                    item.lineRef.current.setDrawRange(range[0], range[1]);
                    item.lineRef.current.attributes.position.needsUpdate = true;
                });
            }
            else if (sample.type == 'config'){
                setRun(sample.sessionRun);
            }
            */
        };
        return () => {
            ws.current.close();
        }
    }, []);
    
    return(
        <SrApp ws={ws} analog={analog} logic={logic}/>
    )
}
