import { useCallback } from 'react';
import { gql, useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';
import { GET_SESSIONS } from '../queries/getSessions';
import { GET_SESSION } from '../queries/getSession';
import { sidVar, sessionVar,  } from '../../ApolloClient';

const REMOVE_SESSION = gql`
    mutation RemoveSession ($id: ID!) {
        removeSession (id: $id){
            id
            success
        }
    }
`;

const CREATE_SESSION = gql`
    mutation CreateSession{
        newSession {
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;

export const useSessionHandlers = () =>{
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
    
    const [ remove ] = useMutation(REMOVE_SESSION, { update(cache, { data:{ removeSession } }) {
            cache.modify({
                fields: {
                    sessions(sessionRefs, { readField }){
                        return sessionRefs.filter(sesRef => removeSession.id !== readField('id', sesRef));
                    }
                }
            });
        }
    });
    
    const [ create ] = useMutation(CREATE_SESSION, { update(cache, { data } ) {
            /*
            cache.modify({
                fields: {
                    sessions(current, { toReference }){
                        const newSessions = [ ...current]//;, toReference(data.newSession) ];
                        select(current, newSession.id); 
                        return newSessions;
                    }
                }
            });
            */
            const newSes = data.newSession;
            const { sessions } = cache.readQuery({query: GET_SESSIONS});
            cache.writeQuery({query: GET_SESSIONS, data: { sessions: [...sessions, newSes] } });
            select(sessions, newSes.id);
        }
    });
    
    return [ select, create, remove, { data, loading } ]
}
