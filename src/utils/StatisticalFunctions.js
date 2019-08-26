export function generateDieResult(minValue, maxValue) {
    return Math.floor(Math.random( maxValue - minValue + 1 ) ) + minValue;
}