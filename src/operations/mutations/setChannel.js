import { gql, useMutation } from "@apollo/client";
//import { channelsVar } from '../../ApolloClient';

const SET_CHANNEL_OPTS = gql`
    mutation SetChannelOptions($input: [ChanOpt!]){
        setChannelOptions(input: $input){
            success
            error
        }
    }
`;

export const useSetChannel = () =>{
    const [ mutate, { data, error } ] = useMutation(SET_CHANNEL_OPTS);
    return { mutate, data, error };
}
