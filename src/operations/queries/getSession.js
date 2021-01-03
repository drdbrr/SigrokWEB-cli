import { gql } from "@apollo/client";

export const GET_SESSION = gql`
    query GetSession($id:ID!){
        session(id:$id){
            id
            type
            name
            sourcename
            config
            channels
        }
    }
`;
