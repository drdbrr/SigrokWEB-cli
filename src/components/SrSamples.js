import React, { useState, useCallback } from 'react';
import onClickOutside from 'react-onclickoutside';
import { FormDown } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDown } from '../styled/ScSrDropDown';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import { formNum } from '../helpers';

const SrSamplesContent = ({toggle, sample, samples, selectSample})=>{
    console.log('Render SrSamplesContent');
    return(
        <ScSrDropDownContent>
            <div>
            { samples.map((item, i)=>{
                const { num, text } = formNum(item);
                return(
                <ScSrDropDownItem key={i} isSelected={(sample === item)} >
                    <span onClick={()=>{selectSample(item);toggle()}}  >{num + text + ' samples'}</span>
                </ScSrDropDownItem>)}
            ) }
            </div>
        </ScSrDropDownContent>
    )
}

const SrSamples = ({sample, samples, selectSample}) =>{
    console.log('Render SrSamples');
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    SrSamples.handleClickOutside = () => setIsOpen(false);
    const content = <SrSamplesContent toggle={toggle} sample={sample} samples={samples} selectSample={selectSample} />
    const { num, text } = formNum(sample);
    return(
        <div>
            <ScSrDropDown onClick={toggle}>
                <span>{num + text + ' samples'}</span>
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { isOpen? content : null }
        </div>
    )
};

const clickOutsideConfig = {
    handleClickOutside: () => SrSamples.handleClickOutside
};

export default onClickOutside(SrSamples, clickOutsideConfig); 
