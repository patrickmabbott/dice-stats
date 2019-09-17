import React, { Component } from "react";
import { Grid, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import DiceChooseEntry from "./DiceChooserEntry"

export default class DiceChooserComponent extends Component {

    constructor() {
        super();
        this.onChangeCount = this.onChangeCount.bind(this);
    }

    onChangeCount(name, countChange) {
        const { definitions, onChangeCount } = this.props;
        const definition = definitions.get(name);
        onChangeCount(definition, countChange);
    }

    render() {
        const { dicePool, definitions } = this.props;
        const diceCounts = dicePool.diceCounts;

        // const firstRowWidth = Math.min(diceCounts.length, MAX_WIDTH);

        const row1 = diceCounts.slice();
        // const row2 = firstRowWidth > diceCounts.length ? [] : diceCounts.slice(firstRowWidth, 
            // Math.min(firstRowWidth * 2, diceCounts.length) );

        return (
                <Grid columns={diceCounts.length} divided style={{height: 40}}>
                <Grid.Row >
                    {
                        row1.map( (entry, idx) => {
                            const { name, count } = entry;
                            const image = definitions.get(name).image;
                            return (
                                <Grid.Column key={`die${idx}`}>
                                    <DiceChooseEntry 
                                        image={image} 
                                        name={name}
                                        count={count}
                                        onChangeCount={ (newCount) => { this.onChangeCount(name, newCount - count) } }
                                    />
                                </Grid.Column>
                            )
                        })
                    }
                </Grid.Row>
            </Grid>

        )
    }
}