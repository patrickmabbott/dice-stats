import { SET_GAME } from "../actions/OptionsActions";

const initialState = {
    game : 'basic',
    skipAccumulatedProbOfOneHundredPercent : true
}


export default function reduceOptions(state = initialState, action) {
    let finalState = {
        ...state
    };
    switch (action.type) {
        case SET_GAME:
            finalState.game = action.game;
            break;
        default:
            break;
    }
    return finalState;
}