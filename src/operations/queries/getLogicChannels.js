import { gql } from "@apollo/client";

export const GET_LOGIC_CHANNELS = gql`
    query GetLogicChannels($id: ID!){
        logicChannels(id: $id){
            name
            text
        }
    }
`; 
 
