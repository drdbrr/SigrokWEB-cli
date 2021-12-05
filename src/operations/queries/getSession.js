import { gql } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';

export const GET_SESSION = gql`
    query GetSession{
        session @client {
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;

