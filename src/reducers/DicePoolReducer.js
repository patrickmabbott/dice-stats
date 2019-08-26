import { ADD_DIE_TO_POOL, REMOVE_DIE_FROM_POOL, CHOOSE_POOL_KEY } from "../actions/DiePoolActions";

const initializeState = () => {

    const initializationResults = initializeDicePools();

    const dicePools = initializationResults.dicePools;
    

    return {
        dicePools,
        currentDicePoolKey : initializationResults.currentKey,
        currentDicePool : dicePools.get(initializationResults.currentKey)
    }
}

export default function reduceDieSets(state, action) {

    if(state === undefined) {
        state = initializeState();
    }

    switch (action.type) {
        case CHOOSE_POOL_KEY:
            return { 
                ...state, 
                currentDicePoolKey : action.key,
                currentDicePool : state.dicePools.get(action.key)
            };
        case ADD_DIE_TO_POOL:
            const updatedDicePool = state.currentDicePool.clone();
            updatedDicePool.addDice(action.definition, action.count);
            updatedDicePools = new Map(state.dicePools);
            dicePools.set(state.currentDicePoolKey, updatedDicePool);
            return { 
                ...state, 
                currentDicePool : updatedDicePool,
                dicePools : updatedDicePools
            };
        case REMOVE_DIE_FROM_POOL:
            const updatedDicePool = state.dicePool.clone();
            updatedDicePool.removeDice(action.definition, action.count);
            updatedDicePools = new Map(state.dicePools);
            dicePools.set(state.currentDicePoolKey, updatedDicePool);
            return { 
                ...state, 
                currentDicePool : updatedDicePool,
                dicePools : updatedDicePools
            };
        default:
            return state;
    }
}