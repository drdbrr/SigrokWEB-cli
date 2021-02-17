import { gql, useMutation } from "@apollo/client";
import { GET_SESSIONS } from "../queries/getSessions";
import { selectedSessionVar } from '../../ApolloClient';

export const CREATE_SESSION = gql`
    mutation {
        createSession{
            id
            name
        }
    }
`;
export function useCreateSession () {
    const [ mutate, { data, error } ] = useMutation(CREATE_SESSION, { onCompleted: ({createSession})=>selectedSessionVar(createSession.id),
        update(cache, { data }) {
            const newSession = data.createSession;
            const { sessions } = cache.readQuery({query: GET_SESSIONS});
            
            cache.writeQuery({
                query: GET_SESSIONS,
                data: {
                    sessions: [...sessions, newSession]
                }
            });
        }
    });
    return { mutate, data, error };
};
