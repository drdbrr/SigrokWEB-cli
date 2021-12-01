import { gql } from "@apollo/client";

export const GET_SCAN_DEVICES = gql`
    query getScanDevices($drv: String!){
        scanDevices(drv: $drv){
            vendor
            model
            driverName
            connectionId
        }
    }
`;
