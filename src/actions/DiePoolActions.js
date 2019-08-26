import ThresholdDieDefinition from "../data_classes/ThresholdDieDefinition"
import NumericDieDefinition from "../data_classes/NumericDieDefinition";
import DicePool from "../data_classes/DicePool";

export const CHOOSE_POOL_NAME = 'CHOOSE_POOL_NAME';
export const ADD_DIE_TO_POOL = 'ADD_DIE_TO_POOL';
export const REMOVE_DIE_FROM_POOL = 'REMOVE_DIE_FROM_POOL';

export function initializeDicePools() {
    //TODO: Try to load from webcache once implemented.

    //Start out by defining predefined dice and mapping by key
    const definitions = processDefaultDiceDefinitions();
    console.log(`TCL: initializeDicePools -> definitions`, definitions)

    const dicePools = new Map();
    //Define a D&D pool containing 0 of each die from 4 to 100
    const dndPool = defineDndPool(definitions);
    dicePools.set(dndPool.name, dndPool);
    const arkhamPool = defineArkhamPool(definitions);
    dicePools.set(arkhamPool.name, arkhamPool);

    return {
        diceDefinitions : definitions,
        dicePools,
        currentName : dndPool.name
    };
}

export function defineDndPool(definitions) {
    const diceCounts = new Map();
    [4,6,8,10,12,20,100].forEach( entry => {
        const definition = definitions.get(`d${entry}`);
        diceCounts.set(definition.name, 0);
    });
    return new DicePool({ diceCounts, "name" : "D&D"});
}

export function defineArkhamPool(definitions) {
    const diceCounts = new Map();
    Array.from(definitions.values()).filter( entry => {
        return entry.name.includes("Arkham")
    }).forEach (entry => {
        const definition = definitions.get(entry.name);
        diceCounts.set(definition.name, 0);
    });
    return new DicePool({ diceCounts, name : "Arkham"});
}

/**
 * Returns a map of die definitions to their unique key.
 */
export function processDefaultDiceDefinitions() {
    let defaultDefinitions = new Map();
    defaultDefinitions = new Map([...defaultDefinitions, ...defineThresholdDice()]);
    defaultDefinitions = new Map([...defaultDefinitions, ...defineBasicNumericDice()]);
    return defaultDefinitions;
}

/**
 * Covers the d4/6/8/10/12/20/100. Nothing fancy here.
 */
export function defineBasicNumericDice() {
    const result = new Map();
    [4,6,8,10,12,20,100].map( entry => {
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