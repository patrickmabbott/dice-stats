import React, { Component } from "react";
import 'semantic-ui-css/semantic.min.css'
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
        const { probabilities, cumulativeProbabilities, averages, maxProbabilityEntriesToShow, mode } = this.props;
        let labels = [];
        let data = [];
        let labelBelowAverage = undefined;
        let labelAboveAverage = undefined;
        if (probabilities === undefined || probabilities.size === 0) {
            labels = [];
            data = [];
        } else {
            const probabilitiesOfInterest = mode === 'cumulative' ?
                cumulativeProbabilities : probabilities;

            const probabilityKeys = Array.from(probabilitiesOfInterest.keys()).sort((a, b) => { return a < b ? -1 : 1 });

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
                const value = probabilitiesOfInterest.get(key);
                return {
                    x: key,
                    y: parseFloat((value * 100).toFixed(2))
                };
            });
        }

        return (
            <React.Fragment>
                <Bar
                    height={"100%"}
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                label: 'Probability',
                                data: data.map(d => d.y),
                                backgroundColor: data.map(d => {
                                    // We want to highlight the bars on either side of the average (or just the one, if the average matches exactly)
                                    // Because we might skip some integers for large graphs, we can't just compare to floor/ceiling.
                                    return [labelBelowAverage,labelAboveAverage].includes(d.x) ? 'rgba(255,215,0, 1)' : 'rgba(75, 192, 192, 0.2)';
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
                                        // If no data is available, make sure to show the scale between
                                        // 0 and 100%
                                        return (probabilities.size === 0 ? (value * 100) : value) + '%';
                                    }
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        // Show the average value in the tooltip, but only for the bars that are highlighted.
                                        if([labelBelowAverage?.toString(), labelAboveAverage?.toString()].includes(context.label)) {
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