import styled, { css } from 'styled-components';

export const ScSrDropDownItem = styled.div`
    margin-top:5px;
    height: 22px;
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    
    ${props => props.isSelected && css`
        background-color: #2f3f51;
        border-left: 2px solid red;
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
