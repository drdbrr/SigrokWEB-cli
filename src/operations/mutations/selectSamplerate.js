import { gql, useMutation } from "@apollo/client";
import { GET_SESSION } from "../queries/getSession";

export const SELECT_SAMPLERATE = gql`
    mutation SelectSamplerate($id:ID!, $samplerate:String!){
        selectSamplerate(id:$id, samplerate:$samplerate){
            id
            samplerate
        }
    }
`;

export function useSelectSamplerate(){
    const [ mutate, { data, error } ] = useMutation(SELECT_SAMPLERATE, {
        update (cache, { data }) {
            const { selectSamplerate } = data;
            const { session } = cache.readQuery({query: GET_SESSION, variables:{id:selectSamplerate.id}});
            //const { session } = cache.writeQuery({query: GET_SESSION, variables:{id:selectDevice.id}});
            console.log('select samplerate=====>', data);
            /*
            cache.modify({
                fields: {
                    session(existingSessionRefs={}, { readField }) {
                        console.log('existingSessionRefs=====>', existingSessionRefs);
                    },
                },
            });
            */
            cache.writeQuery({
                query: GET_SESSION,
                data: {
                    session: {...session, samplerate:selectSamplerate.samplerate}
                }
            });
        }
    });
    return { mutate, data, error };
}
 
