import React from "react";
import { Label, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import useDiceStore from "../store/diceStore";

export default function GameChooseComponent() {
    const dicePools = useDiceStore(state => state.dicePools);
    const currentDicePool = useDiceStore(state => state.currentDicePool);
    const setCurrentPool = useDiceStore(state => state.setCurrentPool);

    const { derivedFrom: name } = currentDicePool;

    const dropdownOptions = Array.from(dicePools.keys())
        .filter(poolName => {
            return dicePools?.get(poolName)?.isBaseline;
        })
        .map(poolName => {
            return {
                key: poolName,
                text: poolName,
                value: poolName
            }
        });

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                <Label style={{ marginRight: '1em' }}>Game</Label>
                <Dropdown
                    placeholder='Select Dice Pool'
                    fluid
                    selection
                    options={dropdownOptions}
                    value={name}
                    onChange={(e, { value }) => {
                        setCurrentPool(value);
                    }}
                />
            </div>
        </React.Fragment>
    );
}