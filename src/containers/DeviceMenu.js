import React, { useState } from 'react';
import { useQuery, useLazyQuery, useReactiveVar, useApolloClient } from '@apollo/client';
import SrDeviceMenu from '../components/SrDeviceMenu';
import { SrLoading } from '../components/SrLoading';
import { GET_DRIVERS } from '../operations/queries/getDrivers';
import { GET_SCAN_DEVICES } from '../operations/queries/getScanDevices';
import { GET_SESSION } from "../operations/queries/getSession";
import { useSelectDevice } from '../operations/mutations/selectDevice';
import { selectedSessionVar } from '../ApolloClient';

export const DeviceMenu = ({label}) => {
    const id = useReactiveVar(selectedSessionVar);
    const { data, error, loading }  = useQuery(GET_DRIVERS);
    const [ getScanDevices, { data:{scanDevices} = [] } ] = useLazyQuery(GET_SCAN_DEVICES, {onCompleted:({scanDevices})=>setDevices(scanDevices), fetchPolicy: 'no-cache'});
    const { mutate: selectDevice } = useSelectDevice();
    
    const [ devices, setDevices ] = useState([]);
    
    if (loading) return <SrLoading />;
    return (
        <SrDeviceMenu
            label={label}
            drivers={data.drivers}
            devices={devices}
            setDevices={setDevices}
            getScanDevices={ (drv)=>getScanDevices({ variables: { id: id, drv:drv } }) }
            getDevice={ (devNum)=>selectDevice({ variables: { id: id, devNum:devNum }, update (cache, { data }) {
                const newSession = data.selectDevice;
                cache.writeQuery({
                    query: GET_SESSION,//`Category:${id}`
                    data: {
                        session: newSession
                    },
                    variables:{ id: id },
                });
            } }) }
        />
    )
}
