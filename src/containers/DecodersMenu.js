import React from 'react';
import { useQuery } from '@apollo/client';
import { useSelectDecoder } from '../operations/mutations/selectDecoder';
import { GET_DECODERS_LIST } from '../operations/queries/getDecodersList'; 
import { SrDecodersMenu } from '../components/SrDecodersMenu';
import SrLoading from '../components/SrLoading';

export const DecodersMenu = ({ decoderMenu, toggleDecoderMenu })=>{
    const { mutate: selectDecoder } = useSelectDecoder();
    const { data:{decodersList} = [], error, loading }  = useQuery(GET_DECODERS_LIST);
    if (loading) return <SrLoading />;
    return (
        <SrDecodersMenu
            dataList={decodersList}
            decoderMenu={decoderMenu}
            toggleDecoderMenu={toggleDecoderMenu}
            selectDecoder={(pdId)=>selectDecoder({variables:{pdId:pdId}})} 
        />
    )
}
