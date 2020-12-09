import { gql } from "@apollo/client";

export const GET_SAMPLE = gql`
    query GetSample($id: ID!){
        sample(id: $id){
            samples
            sample
        }
    }
`;
 
