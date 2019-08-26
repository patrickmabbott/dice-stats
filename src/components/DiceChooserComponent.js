import React, { Component } from "react";

export default class DiceChooserComponent extends Component {
    render() {
        const { dicePool } = this.props;
        console.log(`TCL: DiceChooserComponent -> render -> dicePool`, dicePool)
        return (
            <div>
                    {dicePool.diceCounts}
            </div>
        )
    }
}