import React, { createRef } from 'react';
import { useQuery } from '@apollo/client';
//import SrDeviceMenu from '../components/SrDeviceMenu';
import { SrLoading } from '../components/SrLoading';
import { GET_LOGIC_CHANNELS } from '../operations/queries/getLogicChannels';
import { selectedSessionVar, testVar } from '../ApolloClient';
import { SrChannelsMenuContent } from '../components/SrChannelsMenu';

const LogicChannelMenu = (props) => {
    const { data, error, loading }  = useQuery(GET_LOGIC_CHANNELS, { variables:{id:selectedSessionVar()}, onCompleted:({logicChannels})=>{
        const arr = [];
        logicChannels.map((item)=>arr.push({...item, lineRef: createRef(), rowRef: createRef()}));
        testVar(arr);
    } });
    return <SrChannelsMenuContent logic={[]} analog={[]}/>
}
 
export default LogicChannelMenu
