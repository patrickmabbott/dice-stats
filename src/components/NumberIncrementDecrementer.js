import { Label, Icon } from "semantic-ui-react";
import React, { Component } from "react";


export default class NumberIncrementDecrementer extends Component {
    render() {
        const {onChange, value, min, max, label} = this.props;
        return (
        <div style={{textAlign : 'center'}}>
            {label && <div style={{marginBottom: '5px'}}>{label}</div>}
            <Icon style={{display: 'inline-block'}} size='small' name='minus' onClick={ () => { if(value > min) onChange(value - 1) }}/>
            <Label style={{display: 'inline-block'}} size='small' type="text" className="number">{value}</Label>
            <Icon style={{display: 'inline-block'}} size='small' name='plus' onClick={ () => { if(value < max) onChange(value + 1) }}/>
        </div>
        )
    }
}
