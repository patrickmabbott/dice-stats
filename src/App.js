import React from 'react';
import DiceChooserContainer from "./containers/DiceChooserContainer"
import StatsContainer from "./containers/StatsContainer"
import './App.css';
import 'semantic-ui-css/semantic.min.css'

function App() {

    return (
        <div>
            <StatsContainer/>
            <DiceChooserContainer/>
        </div>
    );
}

export default App;
