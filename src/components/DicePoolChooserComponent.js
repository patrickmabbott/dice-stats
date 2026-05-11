import React from "react";
import { Grid, Label, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import useDiceStore from "../store/diceStore";

export default function DicePoolChooserComponent() {
    const dicePools = useDiceStore(state => state.dicePools);
    const clearCounts = useDiceStore(state => state.clearCounts);
    const setCurrentPool = useDiceStore(state => state.setCurrentPool);
    const saveCurrentPool = useDiceStore(state => state.saveCurrentPool);

    const getPresetName = (rowNum) => {
        return `preset_${rowNum + 1}`;
    };

    const isRowEnabled = (rowNum) => {
        const name = getPresetName(rowNum);
        return dicePools.has(name);
    };

    const NUM_PRESETS = 4;

    return (
        <div>
            <button style={{width : '100%'}}
                onClick={() => { clearCounts()} }
            >Clear Counts</button>
            <br/><br/>
            <Grid columns={NUM_PRESETS} divided style={{height: 100}}>
                {
                    [...Array(NUM_PRESETS).keys()]
                    .map( (rowNum, idx) => {
                        const rowName = getPresetName(rowNum);
                        const isRowEnabledValue = isRowEnabled(rowNum);
                        return (
                            <Grid.Column key={idx}>
                                <Grid.Row>
                                    {idx + 1}
                                </Grid.Row>
                                <Grid.Row>
                                    <Button
                                    size='small'
                                        onClick={() => { setCurrentPool(rowName)} }
                                        disabled={!isRowEnabledValue}
                                    >L</Button>
                                </Grid.Row>
                                <Grid.Row>
                                    <Button
                                    size='small'
                                        onClick={() => { saveCurrentPool(rowName)} }
                                    >S</Button>
                                </Grid.Row>
                            </Grid.Column>
                        )
                    })
                }
        </Grid>
        </div>
    );
}