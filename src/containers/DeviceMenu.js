import React from 'react';
import { useQuery, useLazyQuery, useReactiveVar } from '@apollo/client';
import SrDeviceMenu from '../components/SrDeviceMenu';
import { SrLoading } from '../components/SrLoading';
import { GET_DRIVERS } from '../operations/queries/getDrivers';
import { GET_SCAN_DEVICES } from '../operations/queries/getScanDevices';
import { useSelectDevice } from '../operations/mutations/selectDevice';
import { selectedSessionVar } from '../ApolloClient';

export const DeviceMenu = ({label}) => {
    const id = useReactiveVar(selectedSessionVar);
    const { data, error, loading }  = useQuery(GET_DRIVERS);
    const [ getScanDevices, { data:{scanDevices} = [] } ] = useLazyQuery(GET_SCAN_DEVICES, {fetchPolicy: 'no-cache'});
    const { mutate: selectDevice } = useSelectDevice();
    
    if (loading) return <SrLoading />;
    return (
        <SrDeviceMenu
            label={label}
            drivers={data.drivers}
            devices={ (scanDevices) ? scanDevices : [] }
            getScanDevices={ (drv)=>getScanDevices({ variables: { id: id, drv:drv } }) }
            getDevice={ (devNum)=>selectDevice({ variables: { id: id, devNum:devNum } }) }
        />
    )
}
