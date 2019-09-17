import { store } from "..";
import { isBuffer } from "util";

export const SET_STATISTICS = 'SET_STATISTICS';
export const RESET_STATISTICS = 'RESET_STATISTICS';

function dispatchSetStatistics(probabilities, cumulativeProbabilities) {
    return {
        type : SET_STATISTICS,
        probabilities,
        cumulativeProbabilities
    }
}

function dispatchResetStatistics() {
    return {
        type : RESET_STATISTICS
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
    
        const probabilities = produceResultsSemiIterative(
            currentDicePool, definitions);
    
        if(probabilities === undefined) {
            return;
        }
    
        //Now, go ahead and calculate cumulative probabilities.
    
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
        return dispatch( dispatchSetStatistics(probabilities, cumulativeProbabilities));
    }
}

const MAX_DIE = 10;

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
    let probabilities;
    let iterations = 0;
    const flattenedDice = dice.filter( ({ count, name}) => {
        return count > 0 && definitions.has(name);
    }).reduce( (accumulator,  {count, name}) => {
        const curDefinition = definitions.get(name);
        return accumulator.concat( new Array(count).fill(curDefinition) );
    }, [] );
    //TODO: Redo as a .reduce instead of a forEach with external vars.
    flattenedDice.forEach( (curDie, idx) => {
        let newProbabilities = new Map();
        const curDieFaceCount = curDie.countFaces();
        const totalFaces = curDie.getNumFaces();
        if(idx === 0) {
            for(const faceCount of curDieFaceCount.values()) {
                const { count : curFaceCount, dieFace } = faceCount;
                const { primaryValue } = dieFace;
                newProbabilities.set(primaryValue, curFaceCount / totalFaces);
                iterations++;
            }
        }
        else {
            for( let [key, value] of probabilities.entries()) {
                for(const faceCount of curDieFaceCount.values()) {
                    const { count : curFaceCount, dieFace } = faceCount;
                    const { primaryValue } = dieFace;
                    const curDieFaceProbability = curFaceCount / totalFaces;
                    iterations++;

                    const existingProbability = value;
                    const newValue = key + primaryValue;
                    const newProbability = existingProbability *
                        curDieFaceProbability;
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

