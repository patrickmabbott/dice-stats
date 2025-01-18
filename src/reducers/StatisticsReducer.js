import { SET_STATISTICS, RESET_STATISTICS, SET_MODE } from "../actions/StatisticsActions";

const initialState = {
    isCalculationCurrent : false,
    primaryProbabilities : new Map(),
    secondaryProbabilities : new Map(),
    cumulativePrimaryProbabilities : new Map(),
    cumulativeSecondaryProbabilities : new Map(),
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
            finalState.primaryProbabilities = action.primaryProbabilities;
            finalState.secondaryProbabilities = action.secondaryProbabilities;
            finalState.cumulativePrimaryProbabilities = action.cumulativePrimaryProbabilities;
            finalState.cumulativeSecondaryProbabilities = action.cumulativeSecondaryProbabilities;
            finalState.averages = action.averages;
            finalState.isCalculationCurrent = true;
            break;
        case SET_MODE:
            finalState.mode = action.mode;
            break;
        case RESET_STATISTICS:
            finalState = initialState;
            break;
        default:
            break;
    }
    return finalState;
}