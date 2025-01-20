import React, { Component } from "react";
import { Label, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class OptionsComponent extends Component {
    render() {
        const { dicePools, currentDicePool, setDicePool } = this.props;
        const { derivedFrom : name } = currentDicePool;

        const dropdownOptions = Array.from(dicePools.keys()
        .filter( name => {
            return dicePools?.get(name)?.isBaseline;
        })
        .map( name  => {
            return {
                key: name,
                text: name,
                value: name
            }
        }));
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
                    setDicePool(value);
                }}
                />
            </div>
                
            </React.Fragment>
        )
    }
}