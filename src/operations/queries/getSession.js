import { gql } from "@apollo/client";

export const GET_SESSION = gql`
    query GetSession($id:ID!){
        session(id:$id){
            id
            name
            sourcename
            config
            channels
        }
    }
`;
