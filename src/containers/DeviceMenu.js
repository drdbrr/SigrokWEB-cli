import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import SrDeviceMenu from '../components/SrDeviceMenu';
import SrLoading from '../components/SrLoading';
import { GET_DRIVERS } from '../operations/queries/getDrivers';
import { GET_SESSIONS } from '../operations/queries/getSessions';
import { GET_SCAN_DEVICES } from '../operations/queries/getScanDevices';

import { useSelectDevice } from '../operations/mutations/selectDevice';
//import { sidVar } from '../ApolloClient';

const DeviceMenu = ({session}) => {
    //const id = useReactiveVar(sidVar);
    //const { data: sessions, loading } = useQuery(GET_SESSIONS);
    const { data: { drivers } = [] }  = useQuery(GET_DRIVERS);
    const [ getScanDevices, { data:{ scanDevices } = [] } ] = useLazyQuery(GET_SCAN_DEVICES, { fetchPolicy: 'no-cache' });
    //, { onCompleted:({scanDevices})=>setDevices(scanDevices), fetchPolicy: 'no-cache' });
    
    const { mutate: selectDevice } = useSelectDevice();
    
    //const [ devices, setDevices ] = useState([]);
    
    //if (loading) return <SrLoading />;
    
    return (
        <SrDeviceMenu
            label={session.sourcename}
            drivers={drivers}
            devices={scanDevices}
            setDevices={null /*setDevices*/}
            getScanDevices={ (drv)=>getScanDevices({ variables: { drv:drv } }) }
            getDevice={ (devNum)=>selectDevice({ variables: { devNum:devNum }, update (cache, { data: newSession  }) {
                cache.modify({
                    id: cache.identify(sessions),
                    fields:{
                        session: (current)=>(newSession),
                    },
                })
                
                //const newSession = data.selectDevice;
                /*
                cache.writeQuery({
                    query: GET_SESSIONS,//`Category:${id}`
                    data: {
                        session: newSession
                    },
                });
                */
            }})
                
            }
        />
    )
}

export default DeviceMenu;
