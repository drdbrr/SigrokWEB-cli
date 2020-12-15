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
    const { data: {sessions} = [], loading } = useQuery(GET_SESSIONS, { onCompleted: ({sessions})=>{
        if (sessions.length && !selectedSessionVar())
            selectedSessionVar(sessions[0].id)
    } });
    
    if (loading ) return <SrLoading />;
    
    return (
        <SrSessionsMenu
            sessions={sessions}
            name={name}
            id={id}
            selectSession={(id)=>selectedSessionVar(id)}
            createSession={createSession}
            deleteSession={(id)=>deleteSession({variables:{id:id}})}
        />
    )
}
