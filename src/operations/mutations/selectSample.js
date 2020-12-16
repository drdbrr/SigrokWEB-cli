import { gql, useMutation } from "@apollo/client";
//import { GET_SESSION } from "../queries/getSession";
import { GET_SAMPLE } from "../queries/getSample";

export const SELECT_SAMPLE = gql`
    mutation SelectSample($id:ID!, $sample:String!){
        selectSample(id:$id, sample:$sample){
            id
            sample
        }
    }
`;

export function useSelectSample(){
    const [ mutate, { data, error } ] = useMutation(SELECT_SAMPLE, {
        update (cache, { data }) {
            const { selectSample } = data;
            
            const { sample } = cache.readQuery({query: GET_SAMPLE, variables:{id:selectSample.id}});
            
            cache.writeQuery({
                query: GET_SAMPLE,
                variables:{id:selectSample.id},
                data: {
                    sample: {...sample, sample:selectSample.sample}
                }
            });
            
            /*
            const { session } = cache.readQuery({query: GET_SESSION, variables:{id:selectSample.id}});
            cache.writeQuery({
                query: GET_SESSION,
                data: {
                    session: {...session, sample:selectSample.sample}
                }
            });
            */
        }
    });
    return { mutate, data, error };
}
 
