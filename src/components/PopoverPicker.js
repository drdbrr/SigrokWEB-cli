import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "./useClickOutside";

import styled from 'styled-components';


 const SwatchDiv = styled.div `
    width: 24px;
    height: 16px;
    border-radius: 3px;
    border: 1px solid white;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    
    margin: 2px;
`;

const PopoverDiv = styled.div`
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    border-radius: 9px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
`;

export const PopoverPicker = ({ inRef, color, onChange }) => {
  const popRef = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popRef, close);

  return (
    <div css={`position: relative;`}>
      <SwatchDiv ref={inRef}
        onClick={() => toggle(true)}
      />
        {   isOpen && (
            <PopoverDiv ref={popRef}>
                <HexColorPicker color={color} onChange={onChange} />
            </PopoverDiv>
        )}
    </div>
  );
};
 
