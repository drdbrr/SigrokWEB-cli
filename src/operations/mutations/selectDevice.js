import { gql, useMutation } from "@apollo/client";
//import { GET_SESSION } from "../queries/getSession";
//import { sessionVar } from '../../ApolloClient';
//import { createRef } from 'react';
//import { channelsVar } from '../../ApolloClient';

const SELECT_DEVICE = gql`
    mutation SelectDevice($id:ID!, $devNum:Int!){
        selectDevice(id:$id, devNum:$devNum){
            id
            name
            type
            sourcename
            config
            channels
        }
    }
`;

export function useSelectDevice(){
    const [ mutate, { data, error } ] = useMutation(SELECT_DEVICE/*, { onCompleted:()=>channelsVar({logic:[], analog:[]}) }*/ /*{
        update (cache, { data }) {
            const { selectDevice } = data;
            const { session } = cache.readQuery({query: GET_SESSION, variables:{id:selectDevice.id}});
            //sessionVar( {...session, ref:createRef() });
            //console.log('session==========>', session);
        }
    }*/);
    return { mutate, data, error };
}
