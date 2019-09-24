import React, { Component } from "react";
import { Grid, Label, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class DicePoolChooserComponent extends Component {
    constructor() {
        super();
        this.getPresetName = this.getPresetName.bind(this);
        this.isRowEnabled = this.isRowEnabled.bind(this);
    }

    getPresetName(rowNum) {
        return `preset_${rowNum + 1}`;
    }

    isRowEnabled(rowNum) {
        const name = this.getPresetName(rowNum);
        return this.props.dicePools.has(name);
    }

    render() {
        const NUM_PRESETS = 4;

        return (
                <div>
                <button style={{width : '100%'}}
                    onClick={() => { this.props.onClearCounts()} }
                >Clear Counts</button>
                <br/><br/>
                <Grid columns={NUM_PRESETS} divided style={{height: 100}}>
                    {
                        [...Array(NUM_PRESETS).keys()]
                        .map( (rowNum, idx) => {
                            const rowName = this.getPresetName(rowNum);
                            const isRowEnabled = this.isRowEnabled(rowNum);
                            return (
                                <Grid.Column key={idx}>
                                    <Grid.Row>
                                        {idx + 1}
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Button
                                        size='small'
                                            onClick={() => { this.props.onSetDicePool(rowName)} }
                                            disabled={!isRowEnabled}
                                        >L</Button>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Button
                                        size='small'
                                            onClick={() => { this.props.onSaveDicePool(rowName)} }
                                        >S</Button>
                                    </Grid.Row>
                                </Grid.Column>
                            )
                        })
                    }
            </Grid>
                </div>
        )
    }
}