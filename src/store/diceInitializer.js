import ThresholdDieDefinition from '../data_classes/ThresholdDieDefinition';
import NumericDieDefinition from '../data_classes/NumericDieDefinition';
import SymbolicDie from '../data_classes/SymbolicDie';
import DicePool from '../data_classes/DicePool';
import DiceCount from '../data_classes/DiceCount';
import DieFace from '../data_classes/DieFace';
import redImage from '../res/img/red-die.svg';
import blueImage from '../res/img/blue-die.svg';

export function initializeDicePools() {
  const definitions = processDefaultDiceDefinitions();

  const dicePools = new Map();
  const dndPool = defineDndPool(definitions);
  dicePools.set(dndPool.name, dndPool);
  const arkhamPool = defineArkhamPool(definitions);
  dicePools.set(arkhamPool.name, arkhamPool);
  const divinityPool = defineDivinityPool(definitions);
  dicePools.set(divinityPool.name, divinityPool);

  return {
    diceDefinitions: definitions,
    dicePools,
    currentName: divinityPool.name
  };
}

export function defineDndPool() {
  const diceCounts = [4, 6, 8, 10, 12, 20].map(entry => {
    return new DiceCount({
      count: 0,
      name: `d${entry}`
    });
  });
  return new DicePool({ diceCounts, name: 'D&D', isBaseline: true });
}

export function defineArkhamPool(definitions) {
  const diceCounts = Array.from(definitions.values())
    .filter(entry => entry.name.includes('Arkham'))
    .map(entry => {
      return new DiceCount({
        count: 0,
        name: entry.name
      });
    });
  return new DicePool({
    diceCounts,
    name: 'Arkham',
    isBaseline: true,
    diceResultNames: { primary: 'Successes' }
  });
}

export function defineDivinityPool(definitions) {
  const diceCounts = Array.from(definitions.values())
    .filter(entry => ['White', 'Blue', 'Red'].includes(entry.name))
    .map(entry => {
      return new DiceCount({
        count: 0,
        name: entry.name
      });
    });
  return new DicePool({
    diceCounts,
    name: 'Divinity',
    isBaseline: true,
    diceResultNames: { primary: 'Successes', secondary: 'Crits' }
  });
}

export function processDefaultDiceDefinitions() {
  let defaultDefinitions = new Map();
  defaultDefinitions = new Map([...defaultDefinitions, ...defineArkhamDice()]);
  defaultDefinitions = new Map([...defaultDefinitions, ...defineBasicNumericDice()]);
  defaultDefinitions = new Map([...defaultDefinitions, ...defineDivinityDice()]);
  return defaultDefinitions;
}

export function defineBasicNumericDice() {
  const result = new Map();
  [4, 6, 8, 10, 12, 20, 100].forEach(entry => {
    const definition = new NumericDieDefinition({ numSides: entry });
    result.set(definition.name, definition);
  });
  return result;
}

export function defineArkhamDice() {
  const result = new Map();
  const arkhamD6 = new ThresholdDieDefinition({ name: 'ArkhamDie', numSides: 6, threshold: 5 });
  result.set(arkhamD6.name, arkhamD6);
  const arkhamCurseD6 = new ThresholdDieDefinition({
    name: 'ArkhamCurseDie',
    numSides: 6,
    threshold: 6,
    image: redImage
  });
  result.set(arkhamCurseD6.name, arkhamCurseD6);
  const arkhamBlessD6 = new ThresholdDieDefinition({
    name: 'ArkhamBlessDie',
    numSides: 6,
    threshold: 4,
    image: blueImage
  });
  result.set(arkhamBlessD6.name, arkhamBlessD6);
  return result;
}

export function defineDivinityDice() {
  const result = new Map();
  const blank = new DieFace({ primaryValue: 0, secondaryValue: 0, name: 'Blank' });
  const singlePrimary = new DieFace({ primaryValue: 1, secondaryValue: 0, name: 'SinglePrimary' });
  const doublePrimary = new DieFace({ primaryValue: 2, secondaryValue: 0, name: 'DoublePrimary' });
  const oneSecondary = new DieFace({ primaryValue: 0, secondaryValue: 1, name: 'OneSecondary' });
  const oneEach = new DieFace({ primaryValue: 1, secondaryValue: 1, name: 'OneEach' });

  const whiteDie = new SymbolicDie({
    name: 'White',
    dieFaceCounts: [
      { dieFace: blank, count: 2 },
      { dieFace: singlePrimary, count: 2 },
      { dieFace: doublePrimary, count: 1 },
      { dieFace: oneSecondary, count: 1 }
    ]
  });

  const blueDie = new SymbolicDie({
    name: 'Blue',
    dieFaceCounts: [
      { dieFace: blank, count: 1 },
      { dieFace: singlePrimary, count: 2 },
      { dieFace: doublePrimary, count: 1 },
      { dieFace: oneSecondary, count: 1 },
      { dieFace: oneEach, count: 1 }
    ]
  });

  const redDie = new SymbolicDie({
    name: 'Red',
    dieFaceCounts: [
      { dieFace: singlePrimary, count: 3 },
      { dieFace: doublePrimary, count: 2 },
      { dieFace: oneSecondary, count: 1 }
    ]
  });

  result.set(whiteDie.name, whiteDie);
  result.set(blueDie.name, blueDie);
  result.set(redDie.name, redDie);
  return result;
}

function produceResultsSemiIterative(currentDicePool, definitions) {
  const dice = currentDicePool.diceCounts;
  if (dice.length === 0) {
    throw new Error('Attempting to calculate probabilities with no dice');
  }

  const processProbabilities = (flattenedDice, isPrimary) => {
    let iterations = 0;
    let probabilities = new Map();
    flattenedDice.forEach((curDie, idx) => {
      let newProbabilities = new Map();
      const curDieFaceCount = curDie.countFaces();
      const totalFaces = curDie.getNumFaces();

      let distribution = new Map();
      for (const faceCount of curDieFaceCount.values()) {
        const { count: curFaceCount, dieFace } = faceCount;
        const { primaryValue, secondaryValue } = dieFace;
        const value = isPrimary ? primaryValue : secondaryValue;
        const curValueCount = distribution.get(value) || 0;
        distribution.set(value, curValueCount + curFaceCount);
      }

      if (idx === 0) {
        for (const [value, count] of distribution) {
          newProbabilities.set(value, count / totalFaces);
          iterations++;
        }
      } else {
        for (const [accumulatedValue, probabilityOfAccumValue] of probabilities.entries()) {
          for (const [curFaceValue, curValueCount] of distribution) {
            const curDieFaceProbability = curValueCount / totalFaces;
            iterations++;

            const newValue = accumulatedValue + curFaceValue;
            const newProbability = probabilityOfAccumValue * curDieFaceProbability;
            const probabilityThisStage = newProbabilities.get(newValue) || 0;
            newProbabilities.set(newValue, probabilityThisStage + newProbability);
          }
        }
      }
      probabilities = newProbabilities;
    });
    return probabilities;
  };

  const flattenedDice = dice
    .filter(({ count, name }) => {
      return count > 0 && definitions.has(name);
    })
    .reduce((accumulator, { count, name }) => {
      const curDefinition = definitions.get(name);
      return accumulator.concat(new Array(count).fill(curDefinition));
    }, []);

  return {
    primaryProbabilities: processProbabilities(flattenedDice, true),
    secondaryProbabilities: processProbabilities(flattenedDice, false)
  };
}

export function estimateAverage(currentDicePool, definitions) {
  const dice = currentDicePool.diceCounts;
  if (dice.length === 0) {
    throw new Error('Attempting to calculate probabilities with no dice');
  }
  return dice
    .filter(({ count, name }) => {
      return count > 0 && definitions.has(name);
    })
    .reduce(
      (accumulator, { count, name }) => {
        const curDefinition = definitions.get(name);
        return {
          primary: accumulator.primary + curDefinition.average().primary * count,
          secondary: accumulator.secondary + curDefinition.average().secondary * count
        };
      },
      {
        primary: 0,
        secondary: 0
      }
    );
}

export { produceResultsSemiIterative };
