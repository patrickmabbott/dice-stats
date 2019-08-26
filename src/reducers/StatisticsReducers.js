import { SET_STATISTICS, RESET_STATISTICS } from "../actions/StatisticsActions";

const initialState = {
    isCalculationCurrent : false,
    probabilities : new Map()
}


export default function reduceDieSets(state = initialState, action) {
    let finalState = {
        ...state
    };
    switch (action.type) {
        case SET_STATISTICS:
            finalState.probabilities = actoion.updatedProbabilities;
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