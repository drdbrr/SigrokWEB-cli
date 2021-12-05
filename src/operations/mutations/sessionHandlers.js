import { useCallback } from 'react';

import { gql, useMutation } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';
import { GET_SESSIONS } from '../queries/getSessions';
//import { GET_SESSION } from '../queries/getSession';

import { sidVar, sessionVar,  } from '../../ApolloClient';
//import { useApolloClient } from '@apollo/client';

const DELETE_SESSION = gql`
    mutation DeleteSession ($id: ID!) {
        deleteSession (id: $id){
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

export const select = (sessions, sid = '') =>{
    const ses = sessions.at(sessions.findIndex(ses => ses.id === sid));
    sessionVar(ses.id);
    const url = new URL(window.location);
    url.searchParams.set('sid', ses.id);
    window.history.pushState({}, '', url);
};

export const useSessionHandlers = () =>{
    //const { cache } = useApolloClient();
    //const { sessions } = cache.readQuery(GET_SESSIONS);
    
    /*
    const [ select ] = useMutation(SELECT_SESSION, { update(cache, { data:{ selectSession } }) {
            cache.modify({
                id: cache.identify(sessions),
                fields:{
                    session: (current)=>(selectSession),
                },
            })
        }
    } );
    */
    
    const [ remove ] = useMutation(DELETE_SESSION, { update(cache, { data:{ deleteSession } }) {
        
            cache.modify({
                fields: {
                    sessions(sessionRefs, { readField }){
                        return sessionRefs.filter(sesRef => deleteSession.id !== readField('id', sesRef));
                        
                        //const idx = sessionRefs.findIndex(sesRef => deleteSession.id === readField('id', sesRef));
                        //return sessionRefs.splice(idx, 1);
                    }
                }
            });
        
        
        /*
            cache.modify({
                fields:{
                    sessions: (current)=>
                        [...current.filter((item)=>{
                            if (item.id !== deleteSession.id)
                                return item
                        })]
                    },
                });
            }
        */
        }
    });
    
    
    const [ create ] = useMutation(CREATE_SESSION, { /*refetchQueries: [GET_SESSION],*/ update(cache, { data } ) {
            cache.modify({
                fields: {
                    sessions(current, { toReference }){ 
                        const newSessions = [ ...current, toReference(data.newSession) ];
                        select(current, newSession.id); 
                        return newSessions;
                    }
                }
            });
            /*
            const newSes = data.newSession;
            const { sessions } = cache.readQuery({query: GET_SESSIONS});
            cache.writeQuery({query: GET_SESSIONS, data: { sessions: [...sessions, newSes] } });
            select(newSes.id);
            */
        }
    });
    
    return { create, remove }
}
