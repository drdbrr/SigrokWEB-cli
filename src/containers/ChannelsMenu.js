import React, { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { SrLoading } from '../components/SrLoading';
import { GET_CHANNELS_LIST } from '../operations/queries/getChannelsList';
import { channelsVar } from '../ApolloClient';
import { SrChannelsMenu } from '../components/SrChannelsMenu';

export const ChannelsMenu = ({type}) => {
    const { data, error, loading, refetch }  = useQuery(GET_CHANNELS_LIST);
    
    const groupBy = useCallback((array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
        return result;
        }, {});
    }, []);
    
    const channelGroups = groupBy(Object.values(channelsVar()), 'type');
    
    if (loading) return <SrLoading />;
    return (
        <SrChannelsMenu
            channelGroups={channelGroups}
        />
    )
} 
