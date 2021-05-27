import React, { useState } from 'react';
import { ScSrButton } from '../styled/ScSrButton';
import { ScSrDecoders } from '../styled/ScSrDecoders';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';

import styled, { css } from 'styled-components';

const ScSrListItem = styled.div`
    height: 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    
    ${props => props.isSelected && css`
        background-color: #2a82da;
    `}
    
    :hover{
        background-color: ${props =>props.theme.button};
    }
    
    & > span {
        cursor: pointer;
        margin-left: 5px;
    }
`;

//import * as _ from 'lodash';
//https://github.com/nutboltu/react-search-field

const SrDecodersList = ({dataList, selectDecoder}) =>{
    
    const [ dec, setDec] = useState({id:null, doc:null, name:null, longname:null});
    
    const tags = [];
    dataList.map((item, i)=>item.tags.map((tag, i)=>{
        if(!tags.includes(tag))
            tags.push(tag);
    }));
    
    const dataSet = {};
    tags.map((tag,i)=>{
        const decList = [];
        dataList.map((dec, i)=>{
            if (dec.tags.includes(tag))
                decList.push(dec)
        } );
        dataSet[tag] = decList;
    });
    
    //border: 1px solid rgb(221, 221, 221); display: inline-flex; justify-content: space-between; height: 35px;
    
    return (
        <ScSrDecoders>
            <div>
                <div css={`color:white; font-family: sans-serif;`}>
                    <h4 css={`margin: 0px;`} >Decoder selector</h4>
                    
                    <div css={`background-color: white; height: 20px; color: black; margin-top: 5px; border: 1px solid rgb(221, 221, 221); display: inline-flex; justify-content: space-between;`} >
                        <input
                            css={`outline: currentcolor none medium; border: medium none; font-size: 14px; padding: 10px; flex: 1 1 0%; color: rgb(90, 90, 90); font-weight: 100;`}
                            type="text"
                        />
                    </div>
                    
                </div>
                
                <div css={`overflow-y:auto; color:white; background-color:#232629; height:300px; margin-top: 10px; border: 1px solid black;`} >
                    <ul css={`padding-left: 0px;`} >
                    { dataList.map( (item)=>
                            <li key={item.id} css={`list-style-type: none; `} >
                                <ScSrListItem onClick={()=>setDec(item)} isSelected={ (item.id == dec.id) ? true : false } >
                                    <span css={`padding-right:10px; width:25%;`} >{item.name}</span>
                                    <div css={`overflow: hidden; white-space: nowrap;`} >{item.longname}</div>
                                </ScSrListItem>
                            </li>
                        )
                    }
                    </ul>
                </div>
                <h2 css={`margin-bottom: 3px; color:white;`} >{dec.longname}</h2>
                <span css={`color:white;`} >{dec.desc}</span>
                <div css={`height:150px; background-color:#2d3033; margin-top: 10px; color:white; padding:5px; overflow-y:auto;`} >
                    { /*TEXT TEXT*/ }
                    { dec.doc }
                </div>
            </div>
        </ScSrDecoders>
    )
}

export const SrDecodersMenu = ({dataList, decoderMenu, toggleDecoderMenu, selectDecoder}) => {
    console.log('RENDER SrDecodersMenu');
    return(
        <>
            <ScSrButton onClick={toggleDecoderMenu} css={`float:left; padding-right:7px;`} >
                <span>Decoders</span>
            </ScSrButton>
            { decoderMenu ? <SrDecodersList dataList={dataList} selectDecoder={selectDecoder} />: null }
        </>
    )
}
 
