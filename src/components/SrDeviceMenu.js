import React, { useState, useEffect, forwardRef } from 'react';

import { stateVar } from '../ApolloClient';
import { useReactiveVar } from '@apollo/client';

import {
    useMenuState,
    Menu,
    MenuItem,
    MenuButton,
    MenuSeparator,
} from "reakit/Menu";

import { Button } from "reakit/Button";
import {
    useDialogState,
    Dialog,
    DialogDisclosure,
    DialogBackdrop,
} from "reakit/Dialog";



// import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
// import SrDropDownMenu from './SrDropDownMenu';
// 
// const SrDeviceMenuContent = ({toggle, drivers, devices, getScanDevices, getDevice, setDevices})=>{
//     console.log('Render SrDeviceMenuContent');
//     const [devNum, setDevNum] = useState(true);
//     const [driver, setDriver] = useState(false);
//     const closeOk = (devNum) =>{
//         getDevice(devNum)
//         toggle();
//     }
//     
//     const selectDriver = (event)=>{
//         setDriver(event.target.value);
//         setDevNum(true);
//     };
//     
//     useEffect(()=>{
//         return ()=>setDevices([]);
//     }, []);
//     
//     const selectDevNum = (event)=>setDevNum(event.target.tabIndex);
//     
//     return(
//         <ScSrDropDownContent>
//             <div>
//                 {/*DRIVER*/}
//                 <div>
//                     <span css={`color:white`} >Driver:</span>
//                     <select defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} onChange={ selectDriver }>
//                         <option hidden disabled value="DEFAULT"> -- select an driver -- </option>
//                         { drivers.map((item, i)=>
//                             <option key={i} value={item} >{item}</option>
//                         ) }
//                     </select>
//                 </div>
//                 {/*DRIVER*/}
//             
//                 {/*DEVICE SELECT*/}
//                 <div>
//                     <select size="4" css={`width:300px`} onChange={ selectDevNum }>
//                         { devices.map( (item, i)=>{
//                             const devStr = [item.vendor, item.model, item.driverName, item.connectionId].filter(Boolean).join(" ");
//                             return(
//                             <option 
//                                 value={item.i}
//                                 key={i} >
//                                     { devStr }
//                             </option>)
//                         }) }
//                     </select>
//                 </div>
//                 {/*DEVICE SELECT*/}
//                 
//                 {/*BUTTONS*/}
//                 <div>
//                     <button type="button" disabled={!driver} onClick={ ()=>getScanDevices(driver) }>Scan</button>
//                     <button disabled={devNum} onClick={ ()=>closeOk(devNum) } >OK</button>
//                 </div>
//                 {/*BUTTONS*/}
//             </div>
//         </ScSrDropDownContent>
//     )
// }

/*
const SrDeviceMenu = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    
    return(
        <SrDropDownMenu label={ (props.label) ? props.label : 'Device' } disabled={disabled} >
            <SrDeviceMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}
*/

const SrSelectDialog = forwardRef((props, ref) => {
    const dialog = useDialogState();
    return(
        <>
            <DialogDisclosure ref={ref} {...dialog} {...props}>
                Check for Updates...
            </DialogDisclosure>
            <Dialog {...dialog} aria-label="Check for Updates">
                <p>There are currently no updates available.</p>
                <Button onClick={dialog.hide}>OK</Button>
            </Dialog>
        </>
    )
})

const SrDeviceMenu =(props)=>{
    //const { disabled } = useReactiveVar(stateVar);
    const menu = useMenuState();
    
    return(
        <>
            <MenuButton {...menu} disabled={false} >{ (props.label) ? props.label : 'Device' }</MenuButton>
            <Menu {...menu} style={{zIndex: '100'}} >
                <MenuItem {...menu} {...props} as={SrSelectDialog} />
            </Menu>
        </>
    )
}

export default SrDeviceMenu
