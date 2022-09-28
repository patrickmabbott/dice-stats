import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css'
import {VerticalGridLines, HorizontalGridLines, LabelSeries, XAxis, XYPlot, YAxis, VerticalBarSeries} from 'react-vis';
import { collapseProbabilityResults } from "../utils/StatisticalFunctions";

export default class DiceChooserComponent extends Component {

    constructor() {
        super();
    }

    render() {
        const { probabilities, cumulativeProbabilities, maxProbabilityEntriesToShow, mode} = this.props;

        const probabilitiesOfInterest = mode === 'cumulative' ? 
            cumulativeProbabilities : probabilities;

        const probabilityKeys = Array.from(probabilitiesOfInterest.keys()).sort( (a,b) => { return a < b ? -1 : 1 });

        const collapsedProbabilityKeys = collapseProbabilityResults(probabilityKeys, maxProbabilityEntriesToShow);

        //We don't want to just vomit results all over the screen. So, limit to n results, uniformly plucked from throughout the list.


        const labels = Array.from(
            collapsedProbabilityKeys).map( entry => { return entry});
        const data = labels.sort( (a,b) => { return a < b ? -1 : 1 }).map( key => {
            const value = probabilitiesOfInterest.get(key);
            return {
                x : key,
                y : value * 100
            };
        });

        const labelData = labels.sort( (a,b) => { return a < b ? -1 : 1 }).map( key => {
            const value = probabilitiesOfInterest.get(key);
            let normalizedValue = value > .999999 ? 1.0 : value;

            let label;
            if(labels.length > 25) {
                label = `${Math.floor((normalizedValue * 100)).toFixed(0)}`;
            }
            else if(labels.length > 15) {
                label = `${Math.floor((normalizedValue * 100)).toFixed(0)}%`;
            }
            else {
                label = `${Math.floor((normalizedValue * 100)).toFixed(1)}%`;
            }

            return {
                x : key,
                y : (value + .1) * 100,
                xOffset : 10,
                label
            };
        });

        return (
            <React.Fragment>
                <XYPlot
                yType="linear"
                xType="ordinal"
                height={200}
                width={800}
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