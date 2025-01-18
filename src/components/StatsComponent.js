import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css'
import { Dropdown, Label } from 'semantic-ui-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { collapseProbabilityResults } from "../utils/StatisticalFunctions";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default class DiceChooserComponent extends Component {

    constructor() {
        super();
    }

    render() {
        const { 
            primaryProbabilities,
            cumulativePrimaryProbabilities,
            secondaryProbabilities,
            cumulativeSecondaryProbabilities,
            averages,
            maxProbabilityEntriesToShow,
            mode 
        } = this.props;
        let labels = [];
        let data = [];
        let labelBelowAverage = undefined;
        let labelAboveAverage = undefined;


        let probabilities;
        switch(mode) {
            case 'cumulative':
                probabilities = cumulativePrimaryProbabilities;
                break;
            case 'cumulativeSecondary':
                probabilities = cumulativeSecondaryProbabilities;
                break;
            case 'secondary':
                probabilities = secondaryProbabilities;
                break;
            default:
                probabilities = primaryProbabilities;
        }

        if (probabilities === undefined || probabilities.size === 0) {
            labels = [];
            data = [];
        } else {
            const probabilityKeys = Array.from(probabilities.keys()).sort((a, b) => { return a < b ? -1 : 1 });

            // Given enough and/or large enough dice, the number of possible results can be quite large.
            // So, instead of showing a chart with 100 bars, cap the number of bars and only show
            // every nth bar.
            const collapsedProbabilityKeys = collapseProbabilityResults(probabilityKeys, maxProbabilityEntriesToShow);

            labels = Array.from(
                collapsedProbabilityKeys).map(entry => { return entry });

            // Precalculate which label is just below and which just above the average. (Below handles exact equality)
            labelBelowAverage = labels.findLast(label => label <= averages.primary);
            labelAboveAverage = labels.find(label => label > averages.primary);

            data = labels.sort((a, b) => { return a < b ? -1 : 1 }).map(key => {
                const value = probabilities.get(key);
                return {
                    x: key,
                    y: parseFloat((value * 100).toFixed(2))
                };
            });
        }

        //Only provide dropdowns that actually have data.
        const dropdownOptions = [];

        // If we only have one set of probabilities, then we don't need to differentiate between primary and secondary.
        const onlyPrimary = secondaryProbabilities.size <= 1;

        if(primaryProbabilities.size > 1) {
            dropdownOptions.push({ key: 'primary', text: onlyPrimary ? 'Individual Probability' : 'Primary Individual Probability', value: 'primary' });
            dropdownOptions.push({ key: 'cumulative', text: onlyPrimary ? 'Cumulative Probability' : 'Cumulative Probability Primary', value: 'cumulative' });
        }
        if (secondaryProbabilities.size > 1) {
            dropdownOptions.push({ key: 'secondary', text: 'Secondary', value: 'secondary' });
            dropdownOptions.push({ key: 'cumulativeSecondary', text: 'Cumulative Probability Secondary', value: 'cumulativeSecondary' });
        }

        // TODO: Make select metric box not show up if there is no data.
        // However, this is being kept for the same reason as an empty chart. i.e. to maintain consistent layout.
        // Look into making the spacing external.

        return (
            <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1em' }}>
                <Label style={{ marginRight: '1em' }}>Select Metric</Label>
                <Dropdown
                placeholder='Select Metric'
                fluid
                selection
                options={dropdownOptions}
                value={mode}
                onChange={(e, { value }) => {
                    this.props.setMode(value);
                }}
                />
            </div>
            <Bar
                height={"90%"}
                data={{
                labels: labels,
                datasets: [
                    {
                    label: 'Probability',
                    data: data.map(d => d.y),
                    backgroundColor: data.map(d => {
                        return [labelBelowAverage, labelAboveAverage].includes(d.x) ? 'rgba(255,215,0, 1)' : 'rgba(75, 192, 192, 0.2)';
                    }),
                    borderColor: data.map(d => {
                        return [labelBelowAverage, labelAboveAverage].includes(d.x) ? 'rgba(255,215,0, 1)' : 'rgb(182, 192, 75)';
                    }),
                    borderWidth: 1,
                    },
                ],
                }}
                options={{
                scales: {
                    y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                        return (probabilities.size === 0 ? (value * 100) : value) + '%';
                        }
                    }
                    }
                },
                plugins: {
                    tooltip: {
                    callbacks: {
                        label: function (context) {
                        if ([labelBelowAverage?.toString(), labelAboveAverage?.toString()].includes(context.label)) {
                            return context.raw + '%, average= ' + averages.primary;
                        } else {
                            return context.raw + '%';
                        }
                        }
                    }
                    }
                }
                }}
            />
            </React.Fragment>
        )
    }
}