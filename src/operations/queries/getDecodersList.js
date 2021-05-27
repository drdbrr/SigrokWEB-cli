import { gql } from "@apollo/client";

export const GET_DECODERS_LIST = gql`
    query getDecodersList($id: ID!){
        decodersList(id: $id){
            id
            name
            longname
            desc
            tags
            doc
        }
    }
`;
