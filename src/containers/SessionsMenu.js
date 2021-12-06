import React from 'react';
import SrSessionsMenu from '../components/SrSessionsMenu';

import { useSessionHandlers } from '../operations/mutations/sessionHandlers';

//import { useQuery } from '@apollo/client';
//import { GET_SESSIONS } from '../operations/queries/getSessions';
//import SrLoading from '../components/SrLoading';

export const SessionsMenu = ({sessions, session, select})=>{
    //const id='123';  //= useReactiveVar(sidVar);
    
    const { create, remove } = useSessionHandlers();
    //const { data, loading } = useQuery(GET_SESSIONS);
    
    /*
    const selectCb = useCallback((newId)=>{
        const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + newId;
        window.history.pushState({ path: refresh }, '', refresh);
        sidVar(newId)
    },[]);
    */
    
    /*
    const selectSes = useCallback((id)=>{
        async function selSes(id) {
            let response = await fetch(`/sigrok?sid=${id}`);
            let data = await response.json();
        }
    },[]);
    */
    
    //if (loading ) return <SrLoading />;
    
    //const { name } = sessions.find( (item)=> item.id === id );
    //const name = '';
    //const sessions = [];
    
    //console.log("data==========>", data);
    
    return (
        <SrSessionsMenu
            name={session.name}
            sessions={sessions}
            id={session.id}
            selectSession={(id)=>select(sessions, id)}
            createSession={create}
            deleteSession={(id)=>remove({variables:{id:id}})}
        />
    )
}
