import React, { memo } from 'react';

export const SrTabularMenu = memo(() => {
    console.log('RENDER SrTabularMenu');
    return(
        <div css={`height:calc(100% - 30px); width:25%; background-color:red; position:absolute; right:0px; top:30px; z-index:200;`} >tabular</div>
    )
}) 
