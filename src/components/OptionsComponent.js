import React, { Component } from "react";
import { Label, Dropdown } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

export default class OptionsComponent extends Component {
    render() {
        const { game, setGame } = this.props;
        // TODO: Componentize the Label/dropdown pair for consistency.

        const dropdownOptions = [
            { key: 'basic', text: 'Basic Dice Set (e.g. D&D)', value: 'basic' },
            { key: 'divinity', text : 'Divinity Board Game', value: 'divinity' }
        ];

        return (
            <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                <Label style={{ marginRight: '1em' }}>Game</Label>
                <Dropdown
                placeholder='Select Game'
                fluid
                selection
                options={dropdownOptions}
                value={game}
                onChange={(e, { value }) => {
                    this.props.setGame(value);
                }}
                />
            </div>
                
            </React.Fragment>
        )
    }
}