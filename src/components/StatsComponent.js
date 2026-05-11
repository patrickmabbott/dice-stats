import React, { useEffect } from "react";
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
import useDiceStore from "../store/diceStore";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function StatsComponent() {
    const recalculate = useDiceStore(state => state.recalculate);
    const setMode = useDiceStore(state => state.setMode);
    const primaryProbabilities = useDiceStore(state => state.primaryProbabilities);
    const cumulativePrimaryProbabilities = useDiceStore(state => state.cumulativePrimaryProbabilities);
    const secondaryProbabilities = useDiceStore(state => state.secondaryProbabilities);
    const cumulativeSecondaryProbabilities = useDiceStore(state => state.cumulativeSecondaryProbabilities);
    const averages = useDiceStore(state => state.averages);
    const maxProbabilityEntriesToShow = useDiceStore(state => state.maxProbabilityEntriesToShow);
    const mode = useDiceStore(state => state.mode);
    const diceResultNames = useDiceStore(state => state.currentDicePool.diceResultNames);

    useEffect(() => {
        recalculate();
    }, [recalculate]);

    const {
        primary: primaryName,
        secondary: secondaryName
    } = diceResultNames;
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
            break;
    }

    if (probabilities === undefined || probabilities.size === 0) {
        labels = [];
        data = [];
    } else {
        const probabilityKeys = Array.from(probabilities.keys()).sort((a, b) => { return a < b ? -1 : 1 });

        const collapsedProbabilityKeys = collapseProbabilityResults(probabilityKeys, maxProbabilityEntriesToShow);

        labels = Array.from(
            collapsedProbabilityKeys).map(entry => { return entry });

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

    const dropdownOptions = [];

    const onlyPrimary = secondaryProbabilities.size <= 1;

    if(primaryProbabilities.size > 1) {
        dropdownOptions.push({ key: 'primary', text: onlyPrimary ? 'Probability Exactly' : `${primaryName} Probability Exactly`, value: 'primary' });
        dropdownOptions.push({ key: 'cumulative', text: onlyPrimary ? 'Probability At Least' : `${primaryName} Probability At Least`, value: 'cumulative' });
    }
    if (secondaryProbabilities.size > 1) {
        dropdownOptions.push({ key: 'secondary', text: `${secondaryName} Probability Exactly`, value: 'secondary' });
        dropdownOptions.push({ key: 'cumulativeSecondary', text: `${secondaryName} Probability At Least`, value: 'cumulativeSecondary' });
    }

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
                setMode(value);
            }}
            />
        </div>
        <Bar
            height={"50%"}
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
                        let result = context.raw + `%, averages= ${primaryName}=${averages.primary.toFixed(2)}`;
                        if(secondaryProbabilities.size > 1) {
                            result += `, ${secondaryName}=${averages.secondary.toFixed(2)}`;
                        }
                        return result;
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
    );
}