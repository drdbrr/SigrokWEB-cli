import React from 'react';

const TabularList = ()=>{
    return(<div css={`height:calc(100% - 30px); width:25%; background-color:red; position:absolute; right:0px; top:30px; z-index:200;`} >tabular</div>)
}

export const SrTabularMenu = ({toggleTabularMenu, tabularMenu}) => {
    console.log('RENDER SrTabularMenu');
    return(
        <>
            <button  onClick={toggleTabularMenu} >Tabular menu</button>
            { tabularMenu ? <TabularList /> : null }
        </>
    )
}
