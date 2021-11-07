import { gql, useMutation } from "@apollo/client";
import { OPTION_FIELDS } from '../fragments/OptionFields';

const SET_OPTION = gql`
    mutation SetOption($id: ID!, $opt: SrConfigKeyType, $value: String){
        setOption(id: $id, opt: $opt, value: $value){
            success
            error
            option {
                ...OptionFields
            }
        }
    }
    ${OPTION_FIELDS}
`;

export function useSetOption(id){
    const [ mutate, { data, error } ] = useMutation(SET_OPTION, { variables:{ id: id }});
    return { mutate, data, error };
}
