import React, { Component } from "react";
import { Grid, Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import {VerticalGridLines, HorizontalGridLines, LabelSeries, XAxis, XYPlot, YAxis, VerticalBarSeries} from 'react-vis';

export default class DiceChooserComponent extends Component {

    constructor() {
        super();
    }

    render() {
        const { probabilities, cumulativeProbabilities, mode} = this.props;

        const probabilitiesOfInterest = mode === 'cumulative' ? 
            cumulativeProbabilities : probabilities;

        const labels = Array.from(
            probabilitiesOfInterest.keys()).map( entry => { return entry});
        const data = labels.sort( (a,b) => { return a < b ? -1 : 1 }).map( key => {
            const value = probabilitiesOfInterest.get(key);
            return {
                x : key,
                y : value * 100
            };
        });

        const labelData = labels.sort( (a,b) => { return a < b ? -1 : 1 }).map( key => {
            const value = probabilitiesOfInterest.get(key);
            return {
                x : key,
                y : (value + .1) * 100,
                xOffset : 20,
                label : `${(value * 100).toFixed(1)}%`
            };
        });

        return (
            <React.Fragment>
                <XYPlot
                yType="linear"
                xType="ordinal"
                height={300}
                width={1200}
                >
                  <LabelSeries
                    animation
                    allowOffsetToBeReversed
                    data={labelData} 
                />
                    <XAxis orientation="bottom" />
                    <YAxis/>
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <VerticalBarSeries
                    colorType="literal"
                    data={data}
                    />
                </XYPlot>
            </React.Fragment>
        )
    }
}