import styled from 'styled-components';

export const ScSrDropDownContent = styled.div`
    position:absolute;
    z-index:2;
    top:calc(${props =>props.theme.menuPanelHeight} + 1px);
    & > div {
        padding-right:3px;
        padding-left:3px;
        display:flex;
        flex-direction:column;
        border: 1px #4c647f solid;
        border-radius:3px;
        background-color: ${props =>props.theme.background};
        position:relative;
        left:6px;
    }
`; 
