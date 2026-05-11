import React from "react";
import { Grid, Image } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import DiceChooseEntry from "./DiceChooserEntry"
import DicePoolChooserComponent from "./DicePoolChooserComponent"
import useDiceStore from "../store/diceStore";

export default function DiceChooserComponent() {
    const dicePool = useDiceStore(state => state.currentDicePool);
    const definitions = useDiceStore(state => state.definitions);
    const addDie = useDiceStore(state => state.addDie);
    const removeDie = useDiceStore(state => state.removeDie);

    const onChangeCount = (name, countChange) => {
        const definition = definitions.get(name);
        if (countChange > 0) {
            addDie(definition, countChange);
        } else if (countChange < 0) {
            removeDie(definition, countChange);
        }
    };

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
                                const image = definitions?.get(name)?.image;
                                return (
                                    <Grid.Column key={`die${idx}`}>
                                        <DiceChooseEntry
                                            image={image}
                                            name={name}
                                            count={count}
                                            onChangeCount={ (newCount) => { onChangeCount(name, newCount - count) } }
                                        />
                                    </Grid.Column>
                                )
                            })
                        }
                    </Grid.Row>
                </Grid>
            </Grid.Column>
            <Grid.Column width={4}>
                <DicePoolChooserComponent/>
            </Grid.Column>
        </Grid>
    );
}