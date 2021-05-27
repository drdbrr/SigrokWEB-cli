import React from 'react';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import { formNum } from '../helpers';
import SrDropDownMenu from './SrDropDownMenu';
import { useReactiveVar } from '@apollo/client';
import { runStateVar } from '../ApolloClient';

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
    const disabled = useReactiveVar(runStateVar);
    const { num, text } = formNum(props.sample);
    return(
        <SrDropDownMenu label={num + text + ' samples'} disabled={disabled} >
            <SrSamplesContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrSamples
