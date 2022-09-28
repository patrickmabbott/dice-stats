import { SET_STATISTICS, RESET_STATISTICS, requestRecalculate } from "../actions/StatisticsActions";

const initialState = {
    isCalculationCurrent : false,
    probabilities : new Map(),
    cumulativeProbabilities : new Map(),
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