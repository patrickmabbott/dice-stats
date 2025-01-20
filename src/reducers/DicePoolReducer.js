import { ADD_DIE_TO_POOL, REMOVE_DIE_FROM_POOL, initializeDicePools, SAVE_CURRENT_POOL, CLEAR_COUNTS, SET_CURRENT_POOL } from "../actions/DiePoolActions";
import DicePool from "../data_classes/DicePool";
import { coalesce } from "../utils/GenericFunctions";

const initializeState = () => {

    const initializationResults = initializeDicePools();
    const { dicePools, currentName} = initializationResults;
    // See if we have local storage entries. If so, load those.
    const storedPools = localStorage.getItem('dicePools');
    // What we have stored is JSON, though. This will need to be converted to classes.
    const storedCurrentName = localStorage.getItem('currentName');
    let poolNameToUse = storedCurrentName || currentName;
    if(storedPools) {
        poolNameToUse = storedCurrentName;
        const poolsJSON = JSON.parse(storedPools);
        for(const pool of poolsJSON) {
            dicePools.set(pool.name, DicePool.fromJSON(pool));
        }
    }
    const currentPoolCopy = dicePools.get(poolNameToUse).clone();
    return {
        dicePools,
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

            // When a pool is saved, store our pool definitions as well as the currently selected pool name to the local storage.
            // We don't want to store the default pools, as we may wish to change those in the future. Just store non-baselines.
            const nonBaselines = Array.from(updatedPools.values()).filter( entry => !entry.isBaseline);
            localStorage.setItem('dicePools', JSON.stringify(nonBaselines));
            localStorage.setItem('currentName', newPoolName);

            return {
                ...state,
                dicePools : updatedPools,
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
            if( coalesce(poolName, '') === '' || !state.dicePools.has(poolName) ) {
                console.error(`Could not find requested pool by name ${poolName}`);
                return state;
            }
            const updatedPool = state.dicePools.get(poolName).clone();
            return {
                ...state,
                currentDicePool : updatedPool
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