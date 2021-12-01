import React from 'react';
import './Loading.css';

import styled, { keyframes } from 'styled-components'

//----------------------SPINNER
const kFrames = [];
kFrames.push(keyframes`
    0% { transform: translate(0px,0px) scale(0); }
    25% { transform: translate(5px,0px) scale(0); }
    50% { transform: translate(10px,0px) scale(1); }
    75% { transform: translate(25px,0px) scale(1); }
    100% { transform: translate(40px,0px) scale(1); }
`);

kFrames.push(keyframes`
    0% { transform: translate(40px,0px) scale(1): }
    100% { transform: translate(40px,0px) scale(0); }
`);

const Ellipsis = styled.div`
  display: inline-block;

  & > div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transform: translate(25px, 0px) scale(1);
    background: #00ced1;
    animation: ${kFrames[0]} 1s infinite cubic-bezier(0, 0.5, 0.5, 1);
    box-sizing: content-box;
  }
  & > div:nth-child(1) {
    background: #00ced1;
    transform: translate(40px, 0px) scale(1);
    animation: ${kFrames[1]} 0.25s infinite cubic-bezier(0, 0.5, 0.5, 1);
  }

  & > div:nth-child(2) {
    animation-delay: -0.25s;
    background: #9300ff;
  }

  & > div:nth-child(3) {
    animation-delay: -0.5s;
    background: #f5d22e;
  }

  & > div:nth-child(4) {
    animation-delay: -0.75s;
    background: #780a27;
  }

  & > div:nth-child(5) {
    animation-delay: -1s;
    background: #01d145;
  }
`;

//______________________________________________

const frm1 = keyframes`
    0% {transform: scale(0);}
    100% {transform: scale(1);}
`;

const frm2 = keyframes`
    0% {transform: translate(0, 0);}
    100% {transform: translate(12px, 0);}
`;

const frm3 = keyframes`
    0% {transform: scale(1);}
    100% {transform: scale(0);}
`;

const Loader = styled.div`
  display: inline-block;
  & > div {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #f39c12;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }

  & > div:nth-child(1) {
    left: 4px;
    animation: ${frm1} 0.3s infinite;
  }

  & > div:nth-child(2) {
    left: 4px;
    animation: ${frm2} 0.3s infinite;
  }

  & > div:nth-child(3) {
    left: 16px;
    animation: ${frm2} 0.3s infinite;
  }

  & > div:nth-child(4) {
    left: 28px;
    animation: ${frm3} 0.3s infinite;
  }
`;

/*<Ellipsis>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</Ellipsis> */

//https://loading.io/spinner/ellipsis/-speaking-discussion-text-ellipsis-typing-move
const SrLoading =()=>{
    return <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
}

/*
const SrLoading =()=>{
    return (
        <Loader>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </Loader>
    )
}
*/

export default SrLoading;
