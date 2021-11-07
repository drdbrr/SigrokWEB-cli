import { gql } from "@apollo/client";
import { OPTION_FIELDS } from '../fragments/OptionFields';

/*
export const GET_OPTIONS = gql`
    query GetOptions($id: ID!, $opts: [ConfKey]){
        options(id: $id, opts: $opts){
            id
            keyName
            ...on EmptyOpt{
                id
            }
            ...on ValueOpt{
                caps
                value
            }
            ...on ListOpt{
                caps
                values
            }
            ...on VlOpt{
                caps
                value
                values
            }
        }
    }
`; 
*/

export const GET_OPTIONS = gql`
    query GetOptions($id: ID!, $opts: [ConfKey]){
        options(id: $id, opts: $opts){
            ...OptionFields
        }
    }
    ${OPTION_FIELDS}
`; 
