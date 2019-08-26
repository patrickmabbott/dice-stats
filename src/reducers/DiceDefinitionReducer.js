import { ADD_DEFINITION, MODIFY_DEFINITION, DELETE_DEFINITION } from "../actions/DieDefinitionActions";
import { initializeDicePools } from "../actions/DiePoolActions";

const initializeState = () => {

    const initializationResults = initializeDicePools();

    const definitions = initializationResults.diceDefinitions;
    

    return {
        definitions
    }
}

export default function reduce(state, action) {

    if(state === undefined) {
        state = initializeState();
    }

    switch (action.type) {
        case ADD_DEFINITION: //At present, addition and modify are effectively identical.
        case MODIFY_DEFINITION:
            const updatedDefinitions = new Map(state.definitions);
            updatedDefinitions.set(action.definition.name, action.definition);
            return {
                ...state, 
                definitions : updatedDefinitions
        };
        case DELETE_DEFINITION:
            const updatedDicePool = state.dicePool.clone();
            updatedDicePool.removeDice(action.definition, action.count);
            const updatedDicePools = new Map(state.dicePools);
            updatedDicePools.set(state.currentDicePoolName, updatedDicePool);
            return { 
                ...state, 
                currentDicePool : updatedDicePool,
                dicePools : updatedDicePools
            };
        default:
            return state;
    }
}