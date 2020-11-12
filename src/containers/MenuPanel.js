import React from 'react';
import { SrMenuPanel } from '../components/SrMenuPanel';
import { SrLoading } from '../components/SrLoading';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_SESSION } from '../operations/queries/getSession';
import { GET_SESSIONS } from '../operations/queries/getSessions';
import { selectedSessionVar } from '../ApolloClient';

export const MenuPanel = ({toggleDecoderMenu, toggleTabularMenu, logic}) =>{
    const id = useReactiveVar(selectedSessionVar);
    
    const { data: {sessions} = [] } = useQuery(GET_SESSIONS, { onCompleted: ({sessions})=>{
        if (sessions.length)
            selectedSessionVar(sessions[0].id) 
    } });
    
    const { data: {session} = {}, loading } = useQuery(GET_SESSION, { variables:{id: id}, skip: (!id)});
    
    //NOTE: need to rework
    if (loading) return <SrMenuPanel session={{}}/>//<SrLoading />;
    
    return(
        <SrMenuPanel
            logic={logic}
            toggleDecoderMenu={toggleDecoderMenu}
            toggleTabularMenu={toggleTabularMenu}
            sessions={sessions}
            session={session}
        />
    )
}
