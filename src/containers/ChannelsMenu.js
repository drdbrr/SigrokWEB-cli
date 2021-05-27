import React, { createRef } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
//import SrDeviceMenu from '../components/SrDeviceMenu';
import { SrLoading } from '../components/SrLoading';
import { GET_CHANNELS } from '../operations/queries/getChannels';
import { selectedSessionVar, channelsVar, runStateVar } from '../ApolloClient';
import { SrChannelsMenu } from '../components/SrChannelsMenu';

export const ChannelsMenu = ({ws}) => {
    const id = useReactiveVar(selectedSessionVar);
    //const channels = useReactiveVar(channelsVar);
    const { data, error, loading }  = useQuery(GET_CHANNELS, { fetchPolicy: 'no-cache', variables:{id:id}, onCompleted:({getChannels})=>{
        const logic = [];
        const analog = [];
        if (getChannels.logic){
            getChannels.logic.map((item)=>logic.push({...item, lineRef: createRef(), rowRef:createRef()}))
        }
        if (getChannels.analog){
            getChannels.analog.map((item)=>analog.push({...item, lineRef: createRef(), rowRef:createRef()}))
        }
        channelsVar({logic:logic, analog:analog})
    } });
    if (loading) return <SrLoading />;
    return <SrChannelsMenu ws={ws}/*logic={channelsVar.logic} analog={channelsVar.analog}*//>
}
