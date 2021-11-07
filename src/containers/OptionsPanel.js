import React, { useCallback, useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { SrLoading } from '../components/SrLoading';
import { selectedSessionVar } from '../ApolloClient';
import { GET_OPTIONS } from '../operations/queries/getOptions';
import SrRunButton from '../components/SrRunButton';
import { SrListOption } from '../components/SrOption';
import { useSetOption } from '../operations/mutations/setOption';

const panelConf = [ 'LIMIT_SAMPLES', 'SAMPLERATE' ];

export const OptionsPanel = ({devopts, type}) => {
    console.log("Render OptionsPanel")
    const id = useReactiveVar(selectedSessionVar);
    
    const { mutate: setOption } = useSetOption(id);
    
    const { data, error, loading, refetch }  = useQuery(GET_OPTIONS, { variables:{ id: id, opts: devopts }});
    
    useEffect(()=>{
        if (type === 'DeviceSession')
            refetch()
    }, [id]);
    
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
 

