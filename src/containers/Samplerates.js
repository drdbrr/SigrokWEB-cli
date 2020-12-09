import React from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { SrLoading } from '../components/SrLoading';
import { useSelectSamplerate } from '../operations/mutations/selectSamplerate';
import { GET_SAMPLERATE } from '../operations/queries/getSamplerate';
import SrSamplerates from '../components/SrSamplerates';
import { selectedSessionVar } from '../ApolloClient';

export const Samplerates = () =>{
    //const id = useReactiveVar(selectedSessionVar);
    const { mutate: selectSamplerate } = useSelectSamplerate();
    const { data:{samplerate} = {samplerate:'', samplerates:[]}, error, loading }  = useQuery(GET_SAMPLERATE, { variables:{id: selectedSessionVar()}, skip: (!selectedSessionVar())});
    if (loading) return <SrLoading />;
    return (
    <SrSamplerates
        samplerates={samplerate.samplerates}
        samplerate={samplerate.samplerate}
        selectSamplerate={(smp)=>selectSamplerate({variables:{id:selectedSessionVar(), samplerate:smp}})}
    />)
}
