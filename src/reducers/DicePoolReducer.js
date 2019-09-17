import { ADD_DIE_TO_POOL, REMOVE_DIE_FROM_POOL, CHOOSE_POOL_NAME, initializeDicePools } from "../actions/DiePoolActions";

const initializeState = () => {

    const initializationResults = initializeDicePools();

    const dicePools = initializationResults.dicePools;
    

    return {
        dicePools,
        currentDicePoolName : initializationResults.currentName,
        currentDicePool : dicePools.get(initializationResults.currentName)
    }
}

export default function reduceDieSets(state, action) {

    if(state === undefined) {
        state = initializeState();
    }

    switch (action.type) {
        case CHOOSE_POOL_NAME: {
            return { 
                ...state, 
                currentDicePoolName : action.name,
                currentDicePool : state.dicePools.get(action.name)
            };
        }
        case ADD_DIE_TO_POOL: {
            const updatedDicePool = state.currentDicePool.clone();
            updatedDicePool.addDice(action.definition, action.count);
            const updatedDicePools = new Map(state.dicePools);
            updatedDicePools.set(state.currentDicePoolName, updatedDicePool);
            return { 
                ...state, 
                currentDicePool : updatedDicePool,
                dicePools : updatedDicePools
            };
        }
        case REMOVE_DIE_FROM_POOL: {
            const updatedDicePool = state.currentDicePool.clone();
            updatedDicePool.removeDice(action.definition, action.count);
            const updatedDicePools = new Map(state.dicePools);
            updatedDicePools.set(state.currentDicePoolName, updatedDicePool);
            return { 
                ...state, 
                currentDicePool : updatedDicePool,
                dicePools : updatedDicePools
            };
        }
        default:
            return state;
    }
}