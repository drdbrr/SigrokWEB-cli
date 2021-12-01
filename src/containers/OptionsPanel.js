import React from 'react';
import { useQuery } from '@apollo/client';
import { SrLoading } from '../components/SrLoading';
import { GET_OPTIONS } from '../operations/queries/getOptions';
import { SrListOption } from '../components/SrOption';

const panelConf = [ 'LIMIT_SAMPLES', 'SAMPLERATE' ];

export const OptionsPanel = ({devopts, type}) => {
    console.log("Render OptionsPanel")
    const { data, error, loading, refetch }  = useQuery(GET_OPTIONS, { variables:{ opts: devopts }});
    
    if (loading) return <SrLoading />;
    
    const optionsElementsList = data.options.map((opt)=>{
        if ( panelConf.includes(opt.keyName) && opt.caps.includes('SET') ){
            if (opt.caps.includes('LIST'))
                return React.createElement(SrListOption, { ...opt, key: opt.id, setOption: setOption });
        }
        return null;
    });
    
    return(
        <div css={`display:flex; flex-direction:row; align-items:center;`} >
            { optionsElementsList }
        </div>
    )
}
 

