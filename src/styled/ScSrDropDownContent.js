import styled from 'styled-components';

export const ScSrDropDownContent = styled.div`
    position:absolute;
    z-index:2;
    top:calc(${props =>props.theme.menuPanelHeight} + 3px);
    & > div {
        display:flex;
        flex-direction:column;
        border-radius:3px;
        background-color: ${props =>props.theme.background};
        position:relative;
        left:6px;
    }
`; 
