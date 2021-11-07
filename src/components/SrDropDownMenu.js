import React, { useState, useRef, useEffect } from 'react';
import { FormDown } from 'grommet-icons';
import { ScSrDropDown } from '../styled/ScSrDropDown';

const SrDropDownMenu = ({ label, icon, children, disabled }) =>{
    const [open, setOpen] = useState(false);
    const toggle = () =>setOpen(!open);
    
    const node = useRef();
    
    const handleClick = e => {
        if (node.current.contains(e.target))
            return;// inside click
        setOpen(false);// outside click
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);
    
    const content = React.cloneElement(React.Children.only(children), { toggle: toggle });
    
    return(
        <div ref={node} >
            <ScSrDropDown onClick={toggle} disabled={disabled} >
                <span>{ label }</span>
                { icon }
                <FormDown size='small' color='white' />
            </ScSrDropDown>
            { (open) ? content : null }
        </div>
    )
}

export default SrDropDownMenu 
