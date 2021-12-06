import React, {useMemo, memo} from 'react';
import { FormClose } from 'grommet-icons';
import { ScSrDropDownContent } from '../styled/ScSrDropDownContent';
import { ScSrDropDownItem } from '../styled/ScSrDropDownItem';
import SrDropDownMenu from './SrDropDownMenu';

//import { stateVar } from '../ApolloClient';
//import { useReactiveVar } from '@apollo/client';

import {
    useMenuState,
    MenuArrow,
    Menu,
    MenuItem,
    MenuButton,
    MenuSeparator,
} from "reakit/Menu";

import styled, { css } from 'styled-components';

const ScMenuButton = styled(MenuButton)`
    height: 20px;
    color: white;
    border-color: ${props => props.theme.border};
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    background-color: ${props => props.disabled ? props.theme.disabled : props.theme.button};
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    
    
    &:not([disabled]):hover {
        background: green;
    }
`;


const ScMenuItem = styled(MenuItem)`
    margin-top:5px;
    height: 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    
    ${props => props.isSelected && css`
        background-color: #2a82da;
        border: 1px solid #53a0ed;
        border-radius: 2px;
    `}
    
    :hover{
        background-color: ${props =>props.theme.button};
    }
    
    & > span {
        cursor: pointer;
        margin-left: 5px;
    }
    & > svg {
        cursor: pointer;
        width:18px;
        height:18px;
        margin-left: 20px;
        margin-right: 3px;
        stroke:grey;
        :hover{
            stroke:red;
            background-color: #bbb;
            border-radius: 50%;
        }
    }
`;

const ScMenu = styled(Menu)`
    position:absolute;
    z-index:2;
    top:calc(${props =>props.theme.menuPanelHeight} + 1px);
    
    padding-right:3px;
    padding-left:3px;
    display:flex;
    flex-direction:column;
    border: 1px #4c647f solid;
    border-radius:3px;
    background-color: ${props =>props.theme.background};
    position:relative;
    left:6px;
`;

export const SrSessionsMenu = ({sessions, name, select, create, remove}) =>{
    console.log('Render SrSessionsMenu');
    const menu = useMenuState();
    
    //useMemo(()=>console.log(menu), [menu]);
    
    return (
        <>
            <ScMenuButton {...menu} title="Create session" >
                {name}
            {/*<MenuArrow {...menu} />*/}
            </ScMenuButton>
            
            <ScMenu {...menu} >
                { sessions.map((item)=>
                    <ScMenuItem {...menu} key={item.id} isSelected={item.name === name} >
                        <span onClick={()=>{select(sessions, item.id)}} >{item.name}</span>
                        <FormClose size='small' color='white' onClick={()=>remove({variables:{id: item.id}})} />
                    </ScMenuItem>)
                }
            
                <MenuSeparator {...menu} />
                <ScMenuItem {...menu} onClick={create} >
                    <span>New...</span>
                </ScMenuItem>
            </ScMenu>
        </>
    );
}
