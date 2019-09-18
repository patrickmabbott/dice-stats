import React, { Component } from "react";
import { Grid, Image } from 'semantic-ui-react'
import NumberIncrementDecrementer from "./NumberIncrementDecrementer"
import 'semantic-ui-css/semantic.min.css'

export default class DiceChooserEntry extends Component {
    render() {
        const { image, count, name, onChangeCount } = this.props;
        const DICE_COUNT_MAX = 12;
        if(image) {
            return (
                <React.Fragment>
                    <Image src={image}/>
                    <br/>
                    <NumberIncrementDecrementer
                        min={0}
                        max={DICE_COUNT_MAX}
                        value={count}
                        onChange={onChangeCount}
                    />
                    <br/>
                    <br/>
                </React.Fragment>
            )
        }
        else {
            return (
                <React.Fragment>
                    {name}
                    <br/>
                    <NumberIncrementDecrementer 
                        min={0} 
                        max={DICE_COUNT_MAX} 
                        value={count} 
                        onChange={onChangeCount} />
                    <br/>
                    <br/>
                </React.Fragment>
            )
        }
    }
}