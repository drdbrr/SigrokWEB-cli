import React, { createRef, useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { SrLoading } from '../components/SrLoading';
import { GET_CHANNELS_LIST } from '../operations/queries/getChannelsList';
import { selectedSessionVar, channelsVar } from '../ApolloClient';
import { SrChannelsMenu } from '../components/SrChannelsMenu';

import { useSetChannel } from '../operations/mutations/setChannel';

export const ChannelsMenu = ({type}) => {
    const id = useReactiveVar(selectedSessionVar);
    const channelGroups = useReactiveVar(channelsVar);
    
    const { mutate: setChannel } = useSetChannel(id);
    
    const { data, error, loading, refetch }  = useQuery(GET_CHANNELS_LIST, { variables:{id:id}});
    
    useEffect(()=>{
        if (type === 'DeviceSession')
            refetch()
    }, [id]);
    
    if (loading) return <SrLoading />;
    return (
        <SrChannelsMenu
            channelGroups={channelGroups}
            setChannel={setChannel}
        />
    )
} 
