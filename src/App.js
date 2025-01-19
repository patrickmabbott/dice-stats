import React from 'react';
import DiceChooserContainer from "./containers/DiceChooserContainer"
import StatsContainer from "./containers/StatsContainer"
import GameChooserContainer from "./containers/GameChooserContainer"
import './App.css';
import 'semantic-ui-css/semantic.min.css'

function App() {

    return (
        <div>
            <GameChooserContainer/>
            <StatsContainer/>
            <DiceChooserContainer/>
        </div>
    );
}

export default App;
