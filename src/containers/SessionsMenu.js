import React from 'react';
import SrSessionsMenu from '../components/SrSessionsMenu';
import { useCreateSession } from '../operations/mutations/createSession';
import { useDeleteSession } from '../operations/mutations/deleteSession';
import { selectedSessionVar } from '../ApolloClient';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_SESSIONS } from '../operations/queries/getSessions';
import { SrLoading } from '../components/SrLoading';

export const SessionsMenu = ({name})=>{
    const id = useReactiveVar(selectedSessionVar);
    const { mutate: createSession } = useCreateSession();
    const { mutate: deleteSession } = useDeleteSession();
    
    const urlParams = new URLSearchParams(window.location.search);
    const srsid = urlParams.get('srsid');
    
    const { data: {sessions} = [], loading } = useQuery(GET_SESSIONS, { onCompleted: ({sessions})=>{
        if (sessions.length && !selectedSessionVar() && !srsid){
            selectedSessionVar(sessions[0].id);
            const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + sessions[0].id;
            window.history.pushState({ path: refresh }, '', refresh);
        }
        else if (srsid){
            if (sessions.find(item => item.id === srsid)){
                selectedSessionVar(srsid);
            }
            else {
                selectedSessionVar(sessions[0].id);
                const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + sessions[0].id;
                window.history.pushState({ path: refresh }, '', refresh);
            }
        }
    } });
    
    if (loading ) return <SrLoading />;
    
    return (
        <SrSessionsMenu
            sessions={sessions}
            name={name}
            id={id}
            selectSession={(id)=>{
                /*
                const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + id;
                window.history.pushState({ path: refresh }, '', refresh);
                */
                selectedSessionVar(id);
            }}
            createSession={createSession}
            deleteSession={(id)=>deleteSession({variables:{id:id}})}
        />
    )
}
