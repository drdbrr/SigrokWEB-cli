import styled from 'styled-components';

export const ScSrMenuPanel = styled.div`
    width:100%;
    height: ${props => props.theme.menuPanelHeight};
    background-color: ${props => props.theme.background};
    display:flex;
    flex-direction:row;
    align-items:center;
`; 
