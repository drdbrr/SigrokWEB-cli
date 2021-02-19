import { gql, useMutation } from "@apollo/client";
import { GET_SESSIONS } from "../queries/getSessions";
import { selectedSessionVar } from '../../ApolloClient';

export const DELETE_SESSION = gql`
    mutation DeleteSession ($id: ID!) {
        deleteSession (id: $id) {
            id
        }
    }
`;

export function useDeleteSession () {
    const [mutate, { data, error }] = useMutation(DELETE_SESSION, {
        update (cache, { data }) {
            const { id } = data.deleteSession;
            const { sessions } = cache.readQuery({query: GET_SESSIONS});
            cache.modify({
                fields: {
                    sessions(existingSessionsRefs=[], { readField }) {
                        sessions.find((item, i, arr)=>{
                            if (item.id === id && selectedSessionVar() === id){
                                
                                let srsid = null;
                                
                                if(i >= 1){
                                    srsid = arr[i-1].id;
                                    selectedSessionVar(arr[i-1].id);
                                }
                                else if (i == 0 && sessions.length > 1){
                                    srsid = arr[0 + 1].id
                                    selectedSessionVar(arr[0 + 1].id);
                                }
                                else if (i == 0 && sessions.length == 1){
                                    selectedSessionVar('');
                                }
                                
                                const refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?srsid=' + srsid;
                                window.history.pushState({ path: refresh }, '', refresh);
                                
                                
                            }
                        });
                        return existingSessionsRefs.filter( (sessionRef) => {
                            return (id !== readField('id', sessionRef))
                        } );
                    },
                },
            });
        }
    })
    return { mutate, data, error };
};
