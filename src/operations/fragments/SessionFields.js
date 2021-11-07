import { gql } from "@apollo/client";

export const SESSION_FIELDS = gql`
    fragment SessionFields on Session {
        id
        name
        sourcename
        ... on DeviceSession {
            drvopts
            devopts
            channels
        }
    }
`;
