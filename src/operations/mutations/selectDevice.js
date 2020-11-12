import { gql, useMutation } from "@apollo/client";
//import { GET_SESSION } from "../queries/getSession";
//import { sessionVar } from '../../ApolloClient';
//import { createRef } from 'react';

export const SELECT_DEVICE = gql`
    mutation SelectDevice($id:ID!, $devNum:Int!){
        selectDevice(id:$id, devNum:$devNum){
            id
            name
            sourcename
            samplerate
            samplerates
            sample
            samples
            analog{
                name
            }
            logic{
                name
            }
        }
    }
`;

export function useSelectDevice(){
    const [ mutate, { data, error } ] = useMutation(SELECT_DEVICE /*, {
        update (cache, { data }) {
            const { selectDevice } = data;
            const { session } = cache.readQuery({query: GET_SESSION, variables:{id:selectDevice.id}});
            sessionVar( {...session, ref:createRef() });
            console.log('session', session);
        }
    }*/);
    return { mutate, data, error };
}
