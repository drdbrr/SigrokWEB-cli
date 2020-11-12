import React from 'react';
import { useSelectSample } from '../operations/mutations/selectSample';
import SrSamples from '../components/SrSamples';
import { selectedSessionVar } from '../ApolloClient';

export const Samples = ({samples, sample}) =>{
    const { mutate: selectSample } = useSelectSample();
    //return(<div>wwww</div>)
    return (<SrSamples samples={samples} sample={sample} selectSample={(smpl)=>selectSample({variables:{id:selectedSessionVar(), sample:smpl}})} />)
}
 
