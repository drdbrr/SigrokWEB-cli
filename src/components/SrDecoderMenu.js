import React from 'react';
import { Samplerates } from '../containers/Samplerates';

export const SrDecoderMenu = () => {
    console.log('RENDER SrDecoderMenu');
    return(
        <div css={`height:calc(100% - 30px); width:25%; background-color:blue; position:absolute; right:0px; top:30px; z-index:200;`} >
            <p>decoder</p>
        </div>
    )
}
