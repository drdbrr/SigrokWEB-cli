import { gql } from "@apollo/client";

export const OPTION_FIELDS = gql`
    fragment OptionFields on Option {
        id
        keyName
        caps
        ...on EmptyOpt{
            id
        }
        ...on ValueOpt{
            value
        }
        ...on ListOpt{
            values
        }
        ...on VlOpt{
            value
            values
        }
    }
`; 
