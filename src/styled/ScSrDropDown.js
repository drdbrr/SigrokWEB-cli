import styled from 'styled-components';

export const ScSrDropDown = styled.div`
    height: 20px;
    color: white;
    border-color: ${props => props.theme.border};
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    background-color: ${props => props.theme.button};
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    :hover{
        border-style: solid;
        border-color: ${props => props.theme.toggleBorder};
        background-color: ${props => props.theme.toggleButton};
    }
    
    & > span {
        cursor: pointer;
        margin-left: 5px;
    }
    & > svg {
        margin-left: 5px;
        margin-right: 3px;
    }
`;
