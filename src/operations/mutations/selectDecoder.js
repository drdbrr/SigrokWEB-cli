import { gql, useMutation } from "@apollo/client";

export const SELECT_DECODER = gql`
    mutation SelectDecoder($id: ID!, $pdId:String!){
        selectDecoder(id: $id, pdId:$pdId){
            id
            name
            longname
            desc
            options{
                id
                desc
                type
                defv
                values
            }
            annotationRows{
                id
                desc
            }
            channels{
                id
                name
                desc
            }
            optChannels{
                id
                name
                desc
            }
        }
    }
`;

export function useSelectDecoder(){
    const [ mutate, { data, error } ] = useMutation(SELECT_DECODER);
    return { mutate, data, error };
}
 
