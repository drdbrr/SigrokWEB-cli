import { gql } from "@apollo/client";
import { OPTION_FIELDS } from '../fragments/OptionFields';

export const GET_OPTIONS = gql`
    query GetOptions($opts: [ConfKey]){
        options(opts: $opts){
            ...OptionFields
        }
    }
    ${OPTION_FIELDS}
`; 
