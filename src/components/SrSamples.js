import React from 'react';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import { formNum } from '../helpers';
import SrDropDownMenu from './SrDropDownMenu';

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

const SrSamples = (props) =>{
    const { num, text } = formNum(props.sample);
    return(
        <SrDropDownMenu label={num + text + ' samples'} >
            <SrSamplesContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrSamples
