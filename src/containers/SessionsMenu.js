import React from 'react';
import SrSessionsMenu from '../components/SrSessionsMenu';
import { useCreateSession } from '../operations/mutations/createSession';
import { useDeleteSession } from '../operations/mutations/deleteSession';
import { selectedSessionVar } from '../ApolloClient';

export const SessionsMenu = ({sessions, session})=>{
    const { mutate: createSession } = useCreateSession();
    const { mutate: deleteSession } = useDeleteSession();
    return (
        <SrSessionsMenu
            sessions={sessions}
            session={session}
            selectSession={(id)=>selectedSessionVar(id)}
            createSession={createSession}
            deleteSession={ (id)=>deleteSession({variables:{id:id}}) }
        />
    )
}
