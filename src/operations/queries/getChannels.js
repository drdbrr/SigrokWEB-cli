import { gql } from "@apollo/client";

export const GET_CHANNELS = gql`
    query GetChannels($id: ID!){
        getChannels(id: $id){
            logic{
                name
                text
                color
                visible
                traceHeight
            }
            analog{
                name
                text
                color
                visible
                pVertDivs
                nVertDivs
                divHeight
                vRes
                autoranging
                conversion
                convThres
                showTraces
            }
        }
    }
`; 
 
