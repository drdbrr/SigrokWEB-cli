import { gql } from "@apollo/client";

export const GET_DRIVERS = gql`
    query GetDriversList {
        drivers
    }
`; 
