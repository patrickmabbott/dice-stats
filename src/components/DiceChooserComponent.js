import React, { Component } from "react";
import { Grid, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import DiceChooseEntry from "./DiceChooserEntry"
import DicePoolChooserContainer from "../containers/DicePoolChooserContainer"

export default class DiceChooserComponent extends Component {

    constructor(props) {
        super(props);
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

        const row1 = diceCounts.slice();

        return (
            <Grid columns={2} divided style={{height : 60}}>
                <Grid.Column width={11}>
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
                </Grid.Column>
                <Grid.Column width={4}>
                    <DicePoolChooserContainer/>
                </Grid.Column>
            </Grid>
        )
    }
}