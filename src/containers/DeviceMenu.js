import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import SrDeviceMenu from '../components/SrDeviceMenu';
import { SrLoading } from '../components/SrLoading';
import { GET_DRIVERS } from '../operations/queries/getDrivers';
import { GET_SCAN_DEVICES } from '../operations/queries/getScanDevices';
import { useSelectDevice } from '../operations/mutations/selectDevice';

export const DeviceMenu = ({session}) => {
    const { data, error, loading }  = useQuery(GET_DRIVERS);
    const [ getScanDevices, { data:{scanDevices} = [] } ] = useLazyQuery(GET_SCAN_DEVICES, {fetchPolicy: 'no-cache'});
    const { mutate: selectDevice } = useSelectDevice();
    if (loading) return <SrLoading />;
    return (
        <SrDeviceMenu
            sourcename={session.sourcename}
            drivers={data.drivers}
            devices={ (scanDevices) ? scanDevices : [] }
            getScanDevices={ (drv)=>getScanDevices({ variables: { id: session.id, drv:drv } }) }
            getDevice={ (devNum)=>selectDevice({ variables: { id: session.id, devNum:devNum } }) }
        />
    )
}
