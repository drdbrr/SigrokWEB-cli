import { gql, useMutation } from "@apollo/client";
//import { GET_SESSIONS } from "../queries/getSessions";
import { SESSION_FIELDS } from '../fragments/SessionFields';



const DELETE_SESSION = gql`
    mutation DeleteSession ($id: ID!) {
        deleteSession (id: $id){
            id
            success
        }
    }
`;

const CREATE_AND_SELECT = gql`
    mutation CreateSession{
        session {
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;

const SELECT_SESSION = gql`
    mutation SelectSession ($id: ID!){
        selectSession (id: $id){
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;

export const useSessionHandlers = () =>{
    
    const [ select ] = useMutation(SELECT_SESSION, { update(cache, { data:{ selectSession } }) {
            cache.modify({
                id: cache.identify(sessions),
                fields:{
                    session: (current)=>(selectSession),
                },
            })
        }
    } );
    
    const [ remove ] = useMutation(DELETE_SESSION, { update(cache, { data:{ deleteSession } }){
            cache.modify({
                id: cache.identify(sessions),
                fields:{
                    sesList: (current)=>
                        [...current.filter((item)=>{
                            if (item.id !== deleteSession.id)
                                return item
                        })]
                    },
                });
            }
        } );
    
    
    const [ create ] = useMutation(CREATE_AND_SELECT, { update(cache, { data: { newSession } }) {
            cache.modify({
                fields:{
                    id: cache.identify(sessions),
                    sesList: (current)=> [...sesList, {id:newSession.id, name:newSession.name} ],
                    session: (current)=> newSession,
                },
            })
            
            /*
            cache.updateQuery({
                query: GET_SESSIONS,
            },
            ({ sesList }) => {
                sessions:{
                    sesList: [...sesList, newSession],
                    selected: selected
                }
            });*/
        }});
    
    return { select, create, remove }
}
