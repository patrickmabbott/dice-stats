import React from 'react';
import DiceChooserComponent from "./components/DiceChooserComponent"
import StatsComponent from "./components/StatsComponent"
import GameChooseComponent from "./components/GameChooseComponent"
import './App.css';
import 'semantic-ui-css/semantic.min.css'

function App() {

    return (
        <div>
            <GameChooseComponent/>
            <StatsComponent/>
            <DiceChooserComponent/>
        </div>
    );
}

export default App;
