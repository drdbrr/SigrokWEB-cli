import styled, { css } from 'styled-components';

export const ScSrDropDownItem = styled.div`
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
