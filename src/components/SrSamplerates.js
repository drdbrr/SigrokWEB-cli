/*
import React, { memo, useMemo } from 'react';

export const SrSamplerates = ({samplerates, samplerate, selectSamplerate}) =>{
    return(
        <select onChange={ (event)=>selectSamplerate(event.target.value) } defaultValue={samplerate} css={`background-color:#015c93; height:20px; color:white; width:120px`} >
        { samplerates.map((item, i)=>{
            //if (item == samplerate){
                //return (<option key={i} value={item} selected >{item}</option>)
            //}
            return (<option key={i} value={item} label={item + ' Hz'} />)
        }) }
        </select>
    )
} 
*/



import React, { useState, useCallback } from 'react';
import onClickOutside from 'react-onclickoutside';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import { formNum } from '../helpers';

const SrSampleratesContent = ({toggle, samplerates, samplerate, selectSamplerate})=>{
    console.log('Render SrSamplerateContent');
    return(
        <ScSrDropDownContent>
            <div>
            { samplerates.map((item, i)=>{
                const { num, text } = formNum(item);
                return(
                <ScSrDropDownItem key={i} isSelected={(samplerate === item)} >
                    <span onClick={()=>{selectSamplerate(item);toggle()}}  >{num + text + 'Hz'}</span>
                </ScSrDropDownItem>)}
            ) }
            </div>
        </ScSrDropDownContent>
    )
}

const SrSamplerates = ({samplerates, samplerate, selectSamplerate}) =>{
    console.log('Render SrSamplerates');
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    SrSamplerates.handleClickOutside = () => setIsOpen(false);
    const content = <SrSampleratesContent toggle={toggle} samplerate={samplerate} samplerates={samplerates} selectSamplerate={selectSamplerate} />
    const { num, text } = formNum(samplerate);
    return(
        <div>
            <ScSrDropDown onClick={toggle}>
                <span>{num + text + 'Hz'}</span>
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
};

const clickOutsideConfig = {
    handleClickOutside: () => SrSamplerates.handleClickOutside
};

export default onClickOutside(SrSamplerates, clickOutsideConfig); 
