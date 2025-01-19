import ThresholdDieDefinition from "../data_classes/ThresholdDieDefinition"
import NumericDieDefinition from "../data_classes/NumericDieDefinition";
import SymbolicDie from "../data_classes/SymbolicDie";
import DicePool from "../data_classes/DicePool";
import DiceCount from "../data_classes/DiceCount"
import DieFace from "../data_classes/DieFace";
import { requestRecalculate } from "./StatisticsActions";

export const ADD_DIE_TO_POOL = 'ADD_DIE_TO_POOL';
export const REMOVE_DIE_FROM_POOL = 'REMOVE_DIE_FROM_POOL';
export const SAVE_CURRENT_POOL = 'SAVE_CURRENT_POOL';
export const CLEAR_COUNTS = 'CLEAR_COUNTS';
export const SET_CURRENT_POOL = 'SET_CURRENT_POOL'

export function initializeDicePools() {
    //TODO: Try to load from webcache once implemented.

    //Start out by defining predefined dice and mapping by key
    const definitions = processDefaultDiceDefinitions();

    const dicePools = new Map();
    //Define a D&D pool containing 0 of each die from 4 to 100
    const dndPool = defineDndPool(definitions);
    dicePools.set(dndPool.name, dndPool);
    const arkhamPool = defineArkhamPool(definitions);
    dicePools.set(arkhamPool.name, arkhamPool);
    const divinityPool = defineDivinityPool(definitions);
    dicePools.set(divinityPool.name, divinityPool);

    const preset1 = dndPool.clone();
    preset1.name = 'preset_1';

    dicePools.set(preset1.name, preset1);

    return {
        diceDefinitions : definitions,
        dicePools,
        currentName : divinityPool.name
        // currentName : dndPool.name
    };
}

export function defineDndPool() {
    const diceCounts = [4,6,8,10,12,20].map( entry => {
        return new DiceCount({
            count : 0,
            name : `d${entry}`
        })
    });
    return new DicePool({ diceCounts, "name" : "D&D"});
}

export function defineArkhamPool(definitions) {
    const diceCounts = Array.from(definitions.values()).filter( entry => {
        return entry.name.includes("Arkham")
    }).map (entry => {
        return new DiceCount({
            count : 0,
            name : `d${entry}`
        })
    });
    return new DicePool({ diceCounts, name : "Arkham", diceResultNames: { primary : 'Successes'}});
}

export function defineDivinityPool(definitions) {
    const diceCounts = Array.from(definitions.values()).filter( entry => {
        return ['White', 'Blue', 'Red'].includes(entry.name)
    }).map (entry => {
        return new DiceCount({
            count : 0,
            name : entry.name
        })
    });
    return new DicePool({ diceCounts, name : "Divinity", diceResultNames: { primary : 'Successes', secondary : 'Crits'}});
}

/**
 * Returns a map of die definitions to their unique key.
 */
export function processDefaultDiceDefinitions() {
    let defaultDefinitions = new Map();
    defaultDefinitions = new Map([...defaultDefinitions, ...defineThresholdDice()]);
    defaultDefinitions = new Map([...defaultDefinitions, ...defineBasicNumericDice()]);
    defaultDefinitions = new Map([...defaultDefinitions, ...defineDivinityDice()]);
    return defaultDefinitions;
}

/**
 * Covers the d4/6/8/10/12/20/100. Nothing fancy here.
 */
export function defineBasicNumericDice() {
    const result = new Map();
    [4,6,8,10,12,20,100].forEach( entry => {
        const definition = new NumericDieDefinition({ numSides : entry });
        result.set(definition.name, definition);
    });
    return result;
}

/**
 * Defines some examples of dice that are basically numeric dice
 * but you need to roll 
 */
export function defineThresholdDice() {
    //For a start, only going to define a d6 that produces "1" on a 5 or a 6. i.e. arkham horror.
    const result = new Map();
    const arkhamD6 = new ThresholdDieDefinition({ name : 'ArkhamDie', numSides : 6, threshold : 5});
    result.set(arkhamD6.name, arkhamD6);
    const arkhamCurseD6 = new ThresholdDieDefinition({ name : 'ArkhamCurseDie', numSides : 6, threshold : 6});
    result.set(arkhamCurseD6.name, arkhamCurseD6);
    const arkhamBlessD6 = new ThresholdDieDefinition({ name : 'ArkhamBlessDie', numSides : 6, threshold : 4});
    result.set(arkhamBlessD6.name, arkhamBlessD6);
    return result;
}

/**
 * Defines the three primary dice in the Divinity Board Game.
 * Note that these are symbolic dice that have both primary and secondary values.
 */
export function defineDivinityDice() {
    //For a start, only going to define a d6 that produces "1" on a 5 or a 6. i.e. arkham horror.
    const result = new Map();
    const blank = new DieFace({ primaryValue : 0, secondaryValue : 0, name : 'Blank'});
    const singlePrimary = new DieFace({ primaryValue : 1, secondaryValue : 0, name : 'SinglePrimary'});
    const doublePrimary = new DieFace({ primaryValue : 2, secondaryValue : 0, name : 'DoublePrimary'});
    const oneSecondary = new DieFace({ primaryValue : 0, secondaryValue : 1, name : 'OneSecondary'});
    const oneEach = new DieFace({ primaryValue : 1, secondaryValue : 1, name : 'OneEach'});
    const whiteDie = new SymbolicDie({ name : 'White', dieFaceCounts : [
        { dieFace : blank, count : 2},
        { dieFace : singlePrimary, count : 2},
        { dieFace : doublePrimary, count : 1},
        { dieFace : oneSecondary, count : 1}
    ]});
    const blueDie = new SymbolicDie({ name : 'Blue', dieFaceCounts : [
        { dieFace : blank, count : 1},
        { dieFace : singlePrimary, count : 2},
        { dieFace : doublePrimary, count : 1},
        { dieFace : oneSecondary, count : 1},
        { dieFace : oneEach, count : 1}
    ]});
    const redDie = new SymbolicDie({ name : 'Red', dieFaceCounts : [
        { dieFace : singlePrimary, count : 3},
        { dieFace : doublePrimary, count : 2},
        { dieFace : oneSecondary, count : 1}
    ]});
    result.set(whiteDie.name, whiteDie);
    result.set(blueDie.name, blueDie);
    result.set(redDie.name, redDie);
    return result;
}

function dispatchAddDieToPool(definition, count) {
    return {
        type : ADD_DIE_TO_POOL,
        definition,
        count
    }
}

function dispatchSaveCurrentPool(newPoolName) {
    return {
        type : SAVE_CURRENT_POOL,
        newPoolName
    }
}

function dispatchClearCounts() {
    return {
        type : CLEAR_COUNTS
    }
}

function dispatchSetCurrentPool(poolName) {
    return {
        type : SET_CURRENT_POOL,
        poolName
    }
}

function dispatchRemoveDieFromPool(definition, count) {
    return {
        type : REMOVE_DIE_FROM_POOL,
        definition,
        count
    }
}

export function requestAddDieToPool(definition, count) {
    return (dispatch) => {
        return Promise.resolve(dispatch(dispatchAddDieToPool(definition, count))).then( () => {
            dispatch(requestRecalculate());
        });
    }
}

export function requestSaveCurrentPool(newPoolName) {
    return (dispatch) => {
        return Promise.resolve(dispatch(dispatchSaveCurrentPool(newPoolName)));
    }
}

export function requestSetCurrentPool(poolName) {
    return (dispatch) => {
        return Promise.resolve(dispatch(dispatchSetCurrentPool(poolName))).then( () => {
            dispatch(requestRecalculate());
        });
    }
}

export function requestClearCounts() {
    return (dispatch) => {
        return Promise.resolve(dispatch(dispatchClearCounts()));
    }
}

export function requestRemoveDieToPool(definition, count) {
    return (dispatch) => {
        return Promise.resolve(dispatch(dispatchRemoveDieFromPool(definition, Math.abs(count)))).then( () => {
            dispatch(requestRecalculate());
        });
    }
}