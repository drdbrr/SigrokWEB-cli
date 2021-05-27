import styled from 'styled-components';

export const ScSrButton = styled.div`
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
    
    cursor: pointer;
    
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    
    :hover{
        border-style: solid;
        border-color: ${props => props.theme.toggleBorder};
        background-color: ${props => props.theme.toggleButton};
    }
    
    & > span {
        
        margin-left: 5px;
    }
    & > svg {
        margin-left: 5px;
        margin-right: 3px;
    }
`; 
