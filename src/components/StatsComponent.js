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
        const { probabilities, cumulativeProbabilities, maxProbabilityEntriesToShow, mode} = this.props;
        let labels = [];
        let data = [];
        if(probabilities === undefined || probabilities.size === 0) {
            labels = [];
            data = [];
        } else {
            const probabilitiesOfInterest = mode === 'cumulative' ? 
                cumulativeProbabilities : probabilities;
    
            const probabilityKeys = Array.from(probabilitiesOfInterest.keys()).sort( (a,b) => { return a < b ? -1 : 1 });
    
            // Given enough and/or large enough dice, the number of possible results can be quite large.
            // So, instead of showing a chart with 100 bars, cap the number of bars and only show
            // every nth bar.
            const collapsedProbabilityKeys = collapseProbabilityResults(probabilityKeys, maxProbabilityEntriesToShow);
    
            labels = Array.from(
                collapsedProbabilityKeys).map( entry => { return entry});
            
            data = labels.sort( (a,b) => { return a < b ? -1 : 1 }).map( key => {
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
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        },
                    ],
                    }}
                    options={{
                    scales: {
                        y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
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
                            label: function(context) {
                            return context.raw + '%';
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