import React, { Component } from "react";
import { Grid, Image } from 'semantic-ui-react'
import NumericInput from "react-numeric-input"
import 'semantic-ui-css/semantic.min.css'

export default class DiceChooserEntry extends Component {
    render() {
        const { image, count, name, onChangeCount } = this.props;
        console.log(`TCL: DiceChooserEntry -> render -> count`, count)
        const DICE_COUNT_MAX = 100;
        if(image) {
            return (
                <React.Fragment>
                    <Image src={image}/>
                    <br/>
                    <NumericInput min={0} max={DICE_COUNT_MAX} value={count} onChange={onChangeCount} />
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    {name}
                    <br/>
                    <NumericInput min={0} max={DICE_COUNT_MAX} value={count} onChange={onChangeCount} />
                </React.Fragment>
            )
        }
    }
}