import { gql, useMutation } from "@apollo/client";
import { GET_SESSION } from "../queries/getSession";

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
            const { session } = cache.readQuery({query: GET_SESSION, variables:{id:selectSample.id}});
            cache.writeQuery({
                query: GET_SESSION,
                data: {
                    session: {...session, sample:selectSample.sample}
                }
            });
        }
    });
    return { mutate, data, error };
}
 
