import React from 'react';
import DiceChooserContainer from "./containers/DiceChooserContainer"
import StatsContainer from "./containers/StatsContainer"
import OptionsContainer from "./containers/OptionsContainer"
import './App.css';
import 'semantic-ui-css/semantic.min.css'

function App() {

    return (
        <div>
            <OptionsContainer/>
            <StatsContainer/>
            <DiceChooserContainer/>
        </div>
    );
}

export default App;
