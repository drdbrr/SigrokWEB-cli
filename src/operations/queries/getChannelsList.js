import { gql } from "@apollo/client";
import { CHANNEL_FIELDS } from '../fragments/ChannelFields';

export const GET_CHANNELS_LIST = gql`
    query GetChanList{
        chanList{
            ...ChannelFields
        }
    }
    ${CHANNEL_FIELDS}
`;
