import { ADD_DIE_TO_POOL, REMOVE_DIE_FROM_POOL, CHOOSE_POOL_NAME, initializeDicePools, SAVE_CURRENT_POOL, CLEAR_COUNTS, SET_CURRENT_POOL } from "../actions/DiePoolActions";
import { coalesce } from "../utils/GenericFunctions";

const initializeState = () => {
    const initializationResults = initializeDicePools();

    const { dicePools, currentName} = initializationResults;

    const currentPoolCopy = dicePools.get(currentName).clone();
    return {
        dicePools,
        currentDicePoolName : currentName,
        currentDicePool : currentPoolCopy
    }
}

export default function reduceDieSets(state, action) {

    if(state === undefined) {
        state = initializeState();
    }

    switch (action.type) {
        case SAVE_CURRENT_POOL: {
            const newPoolName = action.newPoolName;
            const poolCopy = state.currentDicePool.clone();
            poolCopy.name = newPoolName;
            const updatedPools = new Map(state.dicePools);

            updatedPools.set(newPoolName, poolCopy);
            return {
                ...state,
                dicePools : updatedPools,
                currentDicePoolName : newPoolName,
                currentDicePool : poolCopy
            }
        }
        case CLEAR_COUNTS: {
            const updatedPool = state.currentDicePool.clone();
            updatedPool.diceCounts = updatedPool.diceCounts.map( entry => {
                const entryCopy = entry.clone();
                entryCopy.count = 0;
                return entryCopy;
            })
            return {
                ...state,
                currentDicePool : updatedPool
            };
        }
        case SET_CURRENT_POOL: {
            const { poolName } = action;
            console.log(`TCL: reduceDieSets -> poolName`, poolName)
            if( coalesce(poolName, '') === '' || !state.dicePools.has(poolName) ) {
                console.error(`Could not find requested pool by name ${poolName}`);
                return state;
            }
            const updatedPool = state.dicePools.get(poolName).clone();
            console.log(`TCL: reduceDieSets -> updatedPool`, updatedPool)
            return {
                ...state,
                currentDicePool : updatedPool,
                currentDicePoolName : poolName
            };
        }
        case ADD_DIE_TO_POOL: {
            const updatedDicePool = state.currentDicePool.clone();
            updatedDicePool.addDice(action.definition, action.count);
            return { 
                ...state, 
                currentDicePool : updatedDicePool
            };
        }
        case REMOVE_DIE_FROM_POOL: {
            const updatedDicePool = state.currentDicePool.clone();
            updatedDicePool.removeDice(action.definition, action.count);
            return { 
                ...state, 
                currentDicePool : updatedDicePool
            };
        }
        default:
            return state;
    }
}