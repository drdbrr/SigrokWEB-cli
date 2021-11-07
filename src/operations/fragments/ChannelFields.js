import { gql } from "@apollo/client";

export const CHANNEL_FIELDS = gql`
    fragment ChannelFields on Channel {
        name
        text
        color
        index
        enabled
        type
        ... on LogicChannel {
            traceHeight
        }
        ... on AnalogChannel {
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
`; 
