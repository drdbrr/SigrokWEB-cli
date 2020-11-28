import React, { useState, useCallback, } from 'react';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import SrDropDownMenu from './SrDropDownMenu';

const SrDeviceMenuContent = ({toggle, drivers, devices, getScanDevices, getDevice})=>{
    console.log('Render SrDeviceMenuContent');
    const [devNum, setDevNum] = useState(true);
    const [driver, setDriver] = useState(false);
    //const scanCb = useCallback((data)=>setDevices(data.scanDevices), []);
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

const SrDeviceMenu = (props) =>{
    return(
        <SrDropDownMenu label={ (props.label) ? props.label : 'Device' } >
            <SrDeviceMenuContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrDeviceMenu
//export default onClickOutside(SrDeviceMenu, clickOutsideConfig); 
