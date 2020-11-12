import React, { useState, useCallback } from 'react';
import onClickOutside from 'react-onclickoutside';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';

const SrDeviceMenuContent = ({toggle, drivers, devices, getScanDevices, getDevice})=>{
    console.log('Render SrDeviceMenuContent');
    
    //let devNum = true;
    
    const [devNum, setDevNum] = useState(true);
    //const [devices, setDevices] = useState([]);
    const [driver, setDriver] = useState(false);
    
    const scanCb = useCallback((data)=>setDevices(data.scanDevices), []);
    //const [ getScanDevices ] = useLazyQuery(GET_SCAN_DEVICES, {variables: { srpid: srpid, drv: driver }, onCompleted:scanCb});
    
    const closeOk = (devNum) =>{
        getDevice(devNum)
        toggle();
    }
    
    const selectDriver = (event)=>{
        setDriver(event.target.value);
        setDevNum(true);
        //setDevices([]);
    };
    
    const selectDevNum = (event)=>setDevNum(event.target.tabIndex);
    
    return(
        <ScSrDropDownContent>
            <div>
                {/*DRIVER*/}
                <div>
                    <span css={`color:white`} >Driver:</span>
                    <select defaultValue={ 'DEFAULT' } css={`backgroundColor:#015c93; height:20px`} onChange={ selectDriver }>
                        <option hidden disabled value="DEFAULT"> -- select an driver -- </option>
                        { drivers.map((item, i)=>
                            <option key={i} value={item} >{item}</option>
                        ) }
                    </select>
                </div>
                {/*DRIVER*/}
            
                {/*DEVICE SELECT*/}
                <div>
                    <select size="4" css={`width:300px`} onChange={ selectDevNum }>
                        { devices.map( (item, i)=>{return( <option value={item.i} key={i} >{item.vendor + ' ' + item.model + ' ' + item.driverName + ' ' + item.connectionId}</option> )}) }
                    </select>
                </div>
                {/*DEVICE SELECT*/}
                
                {/*BUTTONS*/}
                <div>
                    <button type="button" disabled={!driver} onClick={ ()=>getScanDevices(driver) }>Scan</button>
                    <button disabled={devNum} onClick={ ()=>closeOk(devNum) } >OK</button>
                </div>
                {/*BUTTONS*/}
            </div>
        </ScSrDropDownContent>
    )
}

const SrDeviceMenu = ({drivers, devices, getScanDevices, getDevice, sourcename}) =>{
    console.log('Render SrDeviceMenu');
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    SrDeviceMenu.handleClickOutside = () => setIsOpen(false);
    const content = <SrDeviceMenuContent toggle={toggle} drivers={drivers} devices={devices} getScanDevices={getScanDevices} getDevice={getDevice} />
    return(
        <div>
            <ScSrDropDown onClick={toggle}>
                <span>{ (sourcename) ? sourcename : 'Device' }</span>
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
};

const clickOutsideConfig = {
    handleClickOutside: () => SrDeviceMenu.handleClickOutside
};

export default onClickOutside(SrDeviceMenu, clickOutsideConfig); 
