import React from 'react';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import SrDropDownMenu from './SrDropDownMenu';
import { useReactiveVar } from '@apollo/client';
import { runStateVar } from '../ApolloClient';

const SrListOptionContent = React.memo(({toggle, value, values, setOption, keyName})=>{
    console.log('Render SrOptionContent');
    return(
        <ScSrDropDownContent>
            <div>
            { values.map((item, i)=>{
                return(
                <ScSrDropDownItem key={i} isSelected={(value === item)} >
                    <span onClick={()=>{
                        setOption({variables:{ opt: keyName, value: item }});
                        toggle()
                    }
                    } > {item} </span>
                </ScSrDropDownItem>)}
            ) }
            </div>
        </ScSrDropDownContent>
    )
})

export const SrListOption = (props) =>{
    const disabled = useReactiveVar(runStateVar);
    return(
        <SrDropDownMenu label={props.value} disabled={disabled} >
            <SrListOptionContent { ...props }/>
        </SrDropDownMenu>
    )
}

