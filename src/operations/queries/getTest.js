import { gql } from "@apollo/client";

export const GET_TEST = gql`
    query GetTest($id:ID!) {
        getTest(id: $id)
    }
` 
