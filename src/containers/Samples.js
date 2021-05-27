import React from 'react';
import { useQuery } from '@apollo/client';
import { useSelectSample } from '../operations/mutations/selectSample';
import SrSamples from '../components/SrSamples';
import { selectedSessionVar } from '../ApolloClient';
import { SrLoading } from '../components/SrLoading';
import { GET_SAMPLE } from '../operations/queries/getSample';

export const Samples = (/*{samples, sample}*/) =>{
    const { mutate: selectSample } = useSelectSample();
    
    const { data:{sample} = {sample:'', samples:[]}, error, loading }  = useQuery(GET_SAMPLE, { variables:{id: selectedSessionVar()}, skip: (!selectedSessionVar())});
    if (loading) return <SrLoading />;
    
    return (<SrSamples samples={sample.samples} sample={sample.sample} selectSample={(smpl)=>selectSample({variables:{id:selectedSessionVar(), sample:smpl}})} />)
}
 
