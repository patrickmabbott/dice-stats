import { SET_STATISTICS, RESET_STATISTICS } from "../actions/StatisticsActions";

const initialState = {
    isCalculationCurrent : false,
    probabilities : new Map(),
    cumulativeProbabilities : new Map(),
    averages : { primary : 0, secondary : 0},
    mode : 'cumulative',
    maxProbabilityEntriesToShow : 20,
    zoomedResult : undefined
}


export default function reduceStatistics(state = initialState, action) {
    let finalState = {
        ...state
    };
    switch (action.type) {
        case SET_STATISTICS:
            finalState.probabilities = action.probabilities;
            finalState.cumulativeProbabilities = action.cumulativeProbabilities;
            finalState.averages = action.averages;
            finalState.isCalculationCurrent = true;
            break;
        case RESET_STATISTICS:
            finalState = initialState;
            break;
        default:
            break;
    }
    return finalState;
}