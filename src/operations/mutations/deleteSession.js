import { gql, useMutation } from "@apollo/client";
import { GET_SESSIONS } from "../queries/getSessions";
import { selectedSessionVar } from '../../ApolloClient';

export const DELETE_SESSION = gql`
    mutation DeleteSession ($id: ID!) {
        deleteSession (id: $id)
    }
`;

export function useDeleteSession () {
    const [mutate, { data, error }] = useMutation(DELETE_SESSION, {
        update (cache, { data }) {
            const id = data.deleteSession;
            const { sessions } = cache.readQuery({query: GET_SESSIONS});
            cache.modify({
                fields: {
                    sessions(existingSessionsRefs=[], { readField }) {
                        sessions.find((item, i, arr)=>{
                            if (item.id === id && selectedSessionVar() === id){
                                if(i >= 1){
                                    selectedSessionVar(arr[i-1].id);
                                }
                                else if (i === 0 && sessions.length > 1){
                                    selectedSessionVar(arr[0 + 1].id);
                                }
                                else if (i === 0 && sessions.length === 1){
                                    selectedSessionVar('');
                                }
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
