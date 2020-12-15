import React from 'react';
import SrSessionsMenu from '../components/SrSessionsMenu';
import { useCreateSession } from '../operations/mutations/createSession';
import { useDeleteSession } from '../operations/mutations/deleteSession';
import { selectedSessionVar, testVar } from '../ApolloClient';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_SESSIONS } from '../operations/queries/getSessions';
import { GET_SESSION } from '../operations/queries/getSession';
import { SrLoading } from '../components/SrLoading';

export const SessionsMenu = (/*{sessions, session}*/{session})=>{
    const id = useReactiveVar(selectedSessionVar);
    
    const { mutate: createSession } = useCreateSession();
    const { mutate: deleteSession } = useDeleteSession();
    const { data: {sessions} = [], loading } = useQuery(GET_SESSIONS, { onCompleted: ({sessions})=>{
        if (sessions.length && !selectedSessionVar())
            selectedSessionVar(sessions[0].id)
    } });
    
    //const { data: {session} = {}, loading } = useQuery(GET_SESSION, { variables:{id: id}, skip: (!id)});
    
    if (loading ) return <SrLoading />;
    
    return (
        <SrSessionsMenu
            sessions={sessions}
            session={session /*session ? session : {}*/}
            selectSession={(id)=>selectedSessionVar(id)}
            createSession={createSession}
            deleteSession={(id)=>deleteSession({variables:{id:id}})}
        />
    )
}
