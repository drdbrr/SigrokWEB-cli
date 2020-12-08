import { gql } from "@apollo/client";

export const GET_SAMPLERATE = gql`
    query GetSamplerate($id: ID!){
        samplerate(id: $id){
            samplerates
            samplerate
        }
    }
`;
 
