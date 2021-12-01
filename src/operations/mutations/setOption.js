import { gql, useMutation } from "@apollo/client";
import { OPTION_FIELDS } from '../fragments/OptionFields';

const SET_OPTION = gql`
    mutation SetOption($opt: SrConfigKeyType, $value: String){
        setOption(opt: $opt, value: $value){
            success
            error
            option {
                ...OptionFields
            }
        }
    }
    ${OPTION_FIELDS}
`;

export function useSetOption(){
    const [ mutate, { data, error } ] = useMutation(SET_OPTION);
    return { mutate, data, error };
}
