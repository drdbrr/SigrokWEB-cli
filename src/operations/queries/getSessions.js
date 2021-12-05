import { gql } from "@apollo/client";
import { SESSION_FIELDS } from '../fragments/SessionFields';

export const GET_SESSIONS = gql`
    query GetSessions{
        sessions{
            ...SessionFields
        }
    }
    ${SESSION_FIELDS}
`;
