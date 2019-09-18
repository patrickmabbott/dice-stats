import { Label, Icon } from "semantic-ui-react";
import React, { Component } from "react";


export default class NumberIncrementDecrementer extends Component {
    render() {
        const {onChange, value, min, max} = this.props;
        return (
        <div style={{textAlign : 'center'}}>
            <Icon size='big' name='minus' onClick={ () => { if(value > min) onChange(value - 1) }}/>
            <Label size='big' type="text" className="number">{value}</Label>
            <Icon size='big' name='plus' onClick={ () => { if(value < max) onChange(value + 1) }}/>
        </div>
        )
    }
}
