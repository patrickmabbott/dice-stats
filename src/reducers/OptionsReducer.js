const initialState = {
    skipAccumulatedProbOfOneHundredPercent : true
}

/**
 * Holds configurable constants and other parameters.
 */
export default function reduceOptions(state = initialState, action) {
    let finalState = {
        ...state
    };
    switch (action.type) {
        default:
            break;
    }
    return finalState;
}