import React from 'react';
import { useSelectSamplerate } from '../operations/mutations/selectSamplerate';
import SrSamplerates from '../components/SrSamplerates';
import { selectedSessionVar } from '../ApolloClient';

export const Samplerates = ({samplerates, samplerate}) =>{
    const { mutate: selectSamplerate } = useSelectSamplerate();
    return <SrSamplerates samplerates={samplerates} samplerate={samplerate} selectSamplerate={(smp)=>selectSamplerate({variables:{id:selectedSessionVar(), samplerate:smp}})} />
}
