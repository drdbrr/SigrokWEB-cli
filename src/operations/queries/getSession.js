import { gql } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';

export const GET_SESSION = gql`
    query GetSession($id:ID!){
        session(id:$id){
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;
