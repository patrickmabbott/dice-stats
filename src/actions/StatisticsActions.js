import { store } from "..";

export const SET_STATISTICS = 'SET_STATISTICS';
export const RESET_STATISTICS = 'RESET_STATISTICS';
export const SET_MODE = 'SET_MODE';

function dispatchSetStatistics(primaryProbabilities, secondaryProbabilities, cumulativePrimaryProbabilities, cumulativeSecondaryProbabilities, averages) {
    return {
        type : SET_STATISTICS,
        primaryProbabilities,
        secondaryProbabilities,
        cumulativePrimaryProbabilities,
        cumulativeSecondaryProbabilities,
        averages
    }
}

function dispatchSetMode(mode) {
    return {
        type : SET_MODE,
        mode
    }
}

// function dispatchResetStatistics() {
//     return {
//         type : RESET_STATISTICS
//     }
// }

export function requestSetMode(mode) {
    return (dispatch) => {
        return dispatch(dispatchSetMode(mode));
    }
}

export function requestRecalculate() {
    return (dispatch) => {
        const { 
            dicePoolStore : { currentDicePool },
            diceDefinitionStore : { definitions }
        } = store.getState();
    
        //For now, assuming numeric dice.
        //The procedure here will be to combine dice at each stage
        //so as to take the probabilities from the previous stage and produce new
        //probabilities in an iterative process.
    
        const { primaryProbabilities, secondaryProbabilities } = produceResultsSemiIterative(
            currentDicePool, definitions);
            
        if(primaryProbabilities === undefined) {
            return dispatch(dispatchSetStatistics(new Map(), new Map(), new Map(), new Map(), { primary : 0, secondary : 0}));
        }

        // Create an average (for both primary and secondary values) for the die.
        const averages = estimateAverage(currentDicePool, definitions);
    
        //Now, go ahead and calculate cumulative probabilities.
        const deriveCumulativeProbabilities = (probabilities) => {
            const orderedResults = Array.from(probabilities.keys()).sort( (a,b) => {
                if(a < b) {
                    return -1;
                }
                else if(a > b) {
                    return 1;
                }
                else {
                    return 0;
                }
            }).reverse();
        
            const cumulativeProbabilities = new Map();
        
            orderedResults.reduce( (accumulatedProbability, curResult) => {
                const curResultProbability = probabilities.get(curResult);
                const newAccumulatedProbability = curResultProbability + 
                    accumulatedProbability;
                cumulativeProbabilities.set(curResult, newAccumulatedProbability);
                return newAccumulatedProbability;
            }, 0 );
            return cumulativeProbabilities;
        };

        const cumulativePrimaryProbabilities = deriveCumulativeProbabilities(primaryProbabilities);
        const cumulativeSecondaryProbabilities = deriveCumulativeProbabilities(secondaryProbabilities);
    

        return dispatch( dispatchSetStatistics(primaryProbabilities, secondaryProbabilities, cumulativePrimaryProbabilities, cumulativeSecondaryProbabilities, averages));
    }
}

// function produceResultsNaive() {
//     const counts = new Map();
//     for(let i = 1; i <= MAX_DIE; i++) {
//         for(let j = 1; j <= MAX_DIE; j++) {
//             for(let k = 1; k <= MAX_DIE; k++) {
//                 for(let l = 1; l <= MAX_DIE; l++) {
//                     const curResult = i + j + k + l;
//                     const curCount = counts.get(curResult) || 0;
//                     counts.set(curResult, curCount + 1);
//                 }
//             }
//         }
//     }
//     const probabilities = new Map();
//     for( const [value, count] of counts.entries()) {
//         probabilities.set(value, count / ( MAX_DIE ^ 4));
//     }
//     return probabilities;
// }

function produceResultsSemiIterative(currentDicePool, definitions) {
    const dice = currentDicePool.diceCounts;
    if(dice.length === 0) {
        throw new Error("Attempting to calculate probabilities with no dice")
    }
    
    //The logic for primary and secondary are essentially identical. So, pull it out.
    const processProbabilities = (flattenedDice, isPrimary) => {
        //TODO: Redo as a .reduce instead of a forEach with external vars.
        let iterations = 0;
        let probabilities = new Map();
        flattenedDice.forEach( (curDie, idx) => {
            let newProbabilities = new Map();
            const curDieFaceCount = curDie.countFaces();
            const totalFaces = curDie.getNumFaces();

            // Find the distribution of values of the current die for the current value type.
            let distribution = new Map();
            for(const faceCount of curDieFaceCount.values()) {
                const { count : curFaceCount, dieFace } = faceCount;
                const { primaryValue, secondaryValue } = dieFace;
                const value = isPrimary ? primaryValue : secondaryValue;
                const curValueCount = distribution.get(value) || 0;
                distribution.set(value, curValueCount + curFaceCount);
            }

            if(idx === 0) {
                for(const [value, count] of distribution) {
                    newProbabilities.set(value, count / totalFaces);
                    iterations++;
                }
            }
            else {
                for( let [accumulatedValue, probabilityOfAccumValue] of probabilities.entries()) {
                    for(const [curFaceValue, curValueCount] of distribution) {
                        const curDieFaceProbability = curValueCount / totalFaces;
                        iterations++;

                        const newValue = accumulatedValue + curFaceValue;
                        const newProbability = probabilityOfAccumValue * curDieFaceProbability;
                        const probabilityThisStage =
                            newProbabilities.get(newValue) || 0;
                        newProbabilities.set(newValue, 
                            probabilityThisStage + newProbability);
                    }
                }
            }
            probabilities = newProbabilities;
        });
            return probabilities;
        }

        const flattenedDice = dice.filter( ({ count, name}) => {
            return count > 0 && definitions.has(name);
        }).reduce( (accumulator,  {count, name}) => {
            const curDefinition = definitions.get(name);
            return accumulator.concat( new Array(count).fill(curDefinition) );
        }, [] );

        return {
            primaryProbabilities : processProbabilities(flattenedDice, true),
            secondaryProbabilities : processProbabilities(flattenedDice, false)
        };
    }

/**
 * Estimates the average result of a die pool.
 * Note that the average is broken up into primary and secondary components.
 */
function estimateAverage(currentDicePool, definitions) {
    const dice = currentDicePool.diceCounts;
    if(dice.length === 0) {
        throw new Error("Attempting to calculate probabilities with no dice")
    }
    return dice.filter( ({ count, name}) => {
        return count > 0 && definitions.has(name);
    }).reduce( (accumulator,  {count, name}) => {
        const curDefinition = definitions.get(name);
        return {
            primary : accumulator.primary + curDefinition.average().primary * count,
            secondary : accumulator.secondary + curDefinition.average().secondary * count
        };
    }, {
        primary : 0,
        secondary : 0
    } );
}

