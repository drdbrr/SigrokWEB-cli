import { gql } from "@apollo/client";
import { CHANNEL_FIELDS } from '../fragments/ChannelFields';

export const GET_CHANNELS_LIST = gql`
    query GetChannelsList($id: ID!){
        channelsList(id: $id){
            ...ChannelFields
        }
    }
    ${CHANNEL_FIELDS}
`;

/*
export const GET_CHANNELS_LIST = gql`
    query GetChannelsList($id: ID!){
        channelsList(id: $id){
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
    }
`;  
*/
