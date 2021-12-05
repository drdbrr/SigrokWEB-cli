import { useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { GET_SESSIONS } from './getSessions';
import { GET_SESSION } from './getSession';
import { sessionVar } from '../../ApolloClient';

export const useGetSessions = () =>{
    
    const [ getSes, ses ] = useLazyQuery(GET_SESSION);
    
    const select = useCallback((sessions, sid = '') =>{
        const ses = sessions.at(sessions.findIndex(ses => ses.id === sid));
        sessionVar(ses.id);
        const url = new URL(window.location);
        url.searchParams.set('sid', ses.id);
        window.history.pushState({}, '', url);
        getSes();
    }, []);
    
    const sess = useQuery(GET_SESSIONS, { onCompleted: ({sessions})=>{
        const sid = (new URL(document.location)).searchParams.get('sid');
        select(sessions, sid);
        getSes();
    }});
    
    const loading = sess.loading || (ses.loading || !ses.data);
    
    const data = { ...sess.data, ...ses.data };
    
    return [ select, { data, loading } ]
}


