import React from 'react';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import { formNum } from '../helpers';
import SrDropDownMenu from './SrDropDownMenu';
import { useReactiveVar } from '@apollo/client';
import { runStateVar } from '../ApolloClient';

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

const SrSamplerates = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    const { num, text } = formNum(props.samplerate);
    return(
        <SrDropDownMenu label={num + text + 'Hz'} disabled={disabled} >
            <SrSampleratesContent { ...props }/>
        </SrDropDownMenu>
    )
}

export default SrSamplerates
