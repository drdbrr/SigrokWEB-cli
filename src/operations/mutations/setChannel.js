import { gql, useMutation } from "@apollo/client";
//import { channelsVar } from '../../ApolloClient';

const SET_CHANNEL_OPTS = gql`
    mutation SetChannelOptions($id: ID!, $input: [ChanOpt!]){
        setChannelOptions(id: $id, input: $input){
            success
            error
        }
    }
`;

export function useSetChannel(id){
    const [ mutate, { data, error } ] = useMutation(SET_CHANNEL_OPTS, { variables:{ id: id } });
    return { mutate, data, error };
}
