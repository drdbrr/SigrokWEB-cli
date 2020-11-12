import { gql } from "@apollo/client";

export const GET_SCAN_DEVICES = gql`
    query getScanDevices($id: ID!, $drv: String!){
        scanDevices(id: $id, drv: $drv){
            vendor
            model
            driverName
            connectionId
        }
    }
`;
