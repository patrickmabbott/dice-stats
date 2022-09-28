export function generateDieResult(minValue, maxValue) {
    return Math.floor(Math.random( maxValue - minValue + 1 ) ) + minValue;
}

export function collapseProbabilityResults(probabilities, maxProbabilityEntriesToShow) {
    if(probabilities.length <= maxProbabilityEntriesToShow) {
        return probabilities.slice();
    } else {
        const results = [];
        const length = probabilities.length;
        let maxIndexProcessed = 0;
        for (let i = 0; i < maxProbabilityEntriesToShow; i++) {
            const nextIndex = Math.floor( (i / maxProbabilityEntriesToShow) * length );
            maxIndexProcessed = nextIndex;
            results.push(probabilities[nextIndex]);
        }
        //I'm going to go ahead and guess that most people will want to see the probability of the maximum possible results.
        //So, instead of letting this chart cap out at like the 95th percentile
        // go ahead and just add in the last entry in the provided probabilities, unless it is already in there
        if(maxIndexProcessed < length - 1) {
            results.push(probabilities[length - 1]);
        }
        return results;
    }
}