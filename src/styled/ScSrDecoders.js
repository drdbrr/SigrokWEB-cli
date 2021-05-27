import styled from 'styled-components';

//<div css={`height:calc(100% - 30px); width:25%; background-color:blue; position:absolute; right:0px; top:30px; z-index:200; overflow-y:auto; color:white`} >

export const ScSrDecoders = styled.div`
    position:absolute;
    z-index:2;
    right:5px;
    top:calc(${props =>props.theme.menuPanelHeight} + 1px);
    height:calc(100% - ${props =>props.theme.menuPanelHeight} - 5px);
    width:25%;
    & > div {
        padding:10px;
        display:block;
        border: 1px #4c647f solid;
        border-radius:3px;
        #background-color: ${props =>props.theme.background};
        background-color: #24384d;
    }
`; 
 
