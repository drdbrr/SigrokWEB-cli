import React from 'react';
import ScMainView from '../styled/ScMainView';
import MenuPanelLayout from './MenuPanelLayout';
import SrCanvas from './CanvasLayout';

const MainViewLayout = () =>{
    console.log('Render MainLayout');
    return(
        <ScMainView>
            <MenuPanelLayout />
            <SrCanvas />
        </ScMainView>
    );
}

export default MainViewLayout;
 
