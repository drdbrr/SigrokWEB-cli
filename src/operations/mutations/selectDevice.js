import { gql, useMutation } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';

const SELECT_DEVICE = gql`
    mutation SelectDevice($id:ID!, $devNum:Int!){
        selectDevice(id:$id, devNum:$devNum){
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;

export function useSelectDevice(){
    const [ mutate, { data, error } ] = useMutation(SELECT_DEVICE);
    return { mutate, data, error };
}
