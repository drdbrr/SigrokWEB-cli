import { gql } from "@apollo/client";

export const GET_DECODERS_LIST = gql`
    query getDecodersList{
        decodersList{
            id
            name
            longname
            desc
            tags
            doc
        }
    }
`;
