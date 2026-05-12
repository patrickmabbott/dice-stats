import { describe, it, expect } from 'vitest';
import NumericDieDefinition from '../data_classes/NumericDieDefinition';
import { computeEffectiveDistribution } from './diceInitializer';

// Monte Carlo simulation for a single die with numReroll chances to reroll
// Strategy: for each reroll chance, if below average, reroll once
function simulateSingleDieRerolls(dieDefinition, numRerolls, numSimulations = 1000) {
  const results = new Map();
  const average = dieDefinition.average().primary;

  for (let sim = 0; sim < numSimulations; sim++) {
    let value = dieDefinition.roll().primaryValue;

    // For each reroll chance, decide whether to reroll (if below average)
    for (let chance = 0; chance < numRerolls; chance++) {
      if (value < average) {
        value = dieDefinition.roll().primaryValue;
      }
    }

    results.set(value, (results.get(value) || 0) + 1);
  }

  // Convert counts to probabilities
  const probabilities = new Map();
  for (const [value, count] of results) {
    probabilities.set(value, count / numSimulations);
  }

  // Debug: log the distribution for first test
  if (numSimulations === 1000 && average === 5.5) {
    console.log('  [DEBUG] d10 simulation distribution:', Array.from(probabilities.entries()).sort((a, b) => a[0] - b[0]));
  }

  return probabilities;
}

function calculateAverage(distribution) {
  let sum = 0;
  let totalProb = 0;
  for (const [value, prob] of distribution) {
    sum += value * prob;
    totalProb += prob;
  }
  return totalProb > 0 ? sum / totalProb : 0;
}

describe('Reroll Mechanics', () => {
  it('should verify die rolls work correctly', () => {
    const d10 = new NumericDieDefinition({ numSides: 10 });
    const rolls = [];
    for (let i = 0; i < 100; i++) {
      rolls.push(d10.roll().primaryValue);
    }
    console.log('  [DEBUG] Sample 100 d10 rolls:', rolls);

    const min = Math.min(...rolls);
    const max = Math.max(...rolls);
    console.log(`  [DEBUG] Min: ${min}, Max: ${max}`);

    expect(min).toBeGreaterThanOrEqual(1);
    expect(max).toBeLessThanOrEqual(10);
    expect(rolls.length).toBe(100);
  });

  it('should correctly compute 3d10 with 5 rerolls by comparing to Monte Carlo', () => {
    // Test parameters
    const d10 = new NumericDieDefinition({ numSides: 10 });
    const numRerolls = 5;
    const numSimulations = 1000;

    // Debug: test a single roll
    const singleRoll = d10.roll().primaryValue;
    console.log(`  [DEBUG] Single d10 roll: ${singleRoll}`);

    // Get analytical solution: compute distribution for a single d10
    const analyticalDist = computeEffectiveDistribution(d10, numRerolls, true);
    const analyticalAvg = calculateAverage(analyticalDist);

    // Get empirical solution: Monte Carlo simulation of 1 d10 with 5 rerolls
    const empiricalDist = simulateSingleDieRerolls(d10, numRerolls, numSimulations);
    const empiricalAvg = calculateAverage(empiricalDist);

    // For 3d10, multiply the average by 3
    const analytical3d10Avg = analyticalAvg * 3;
    const empirical3d10Avg = empiricalAvg * 3;

    console.log(`\n3d10 with 5 rerolls:`);
    console.log(`  Analytical avg: ${analytical3d10Avg.toFixed(4)}`);
    console.log(`  Empirical avg (${numSimulations} sims): ${empirical3d10Avg.toFixed(4)}`);
    console.log(`  Difference: ${Math.abs(analytical3d10Avg - empirical3d10Avg).toFixed(4)}`);

    // Single die comparison
    console.log(`\nSingle d10 with 5 rerolls:`);
    console.log(`  Analytical avg: ${analyticalAvg.toFixed(4)}`);
    console.log(`  Empirical avg: ${empiricalAvg.toFixed(4)}`);
    console.log(`  Difference: ${Math.abs(analyticalAvg - empiricalAvg).toFixed(4)}`);

    // Tolerance: 3% relative error is reasonable for 1000 Monte Carlo samples
    const allowedDifference = empiricalAvg * 0.03; // 3% tolerance
    expect(Math.abs(analyticalAvg - empiricalAvg)).toBeLessThan(allowedDifference);
  });

  it('should return base distribution when rerollCount is 0', () => {
    const d6 = new NumericDieDefinition({ numSides: 6 });
    const distribution = computeEffectiveDistribution(d6, 0, true);

    // All outcomes should have equal probability
    for (let i = 1; i <= 6; i++) {
      expect(distribution.get(i)).toBe(1 / 6);
    }

    const avg = calculateAverage(distribution);
    expect(avg).toBeCloseTo(3.5, 5);
  });

  it('should increase average with more rerolls', () => {
    const d6 = new NumericDieDefinition({ numSides: 6 });

    const avg0 = calculateAverage(computeEffectiveDistribution(d6, 0, true));
    const avg1 = calculateAverage(computeEffectiveDistribution(d6, 1, true));
    const avg2 = calculateAverage(computeEffectiveDistribution(d6, 2, true));
    const avg3 = calculateAverage(computeEffectiveDistribution(d6, 3, true));

    console.log(`\nd6 progression with rerolls:`);
    console.log(`  0 rerolls: ${avg0.toFixed(4)}`);
    console.log(`  1 reroll:  ${avg1.toFixed(4)}`);
    console.log(`  2 rerolls: ${avg2.toFixed(4)}`);
    console.log(`  3 rerolls: ${avg3.toFixed(4)}`);

    // Each reroll should increase the average
    expect(avg1).toBeGreaterThan(avg0);
    expect(avg2).toBeGreaterThan(avg1);
    expect(avg3).toBeGreaterThan(avg2);

    // Verify no reroll gives d6 baseline (3.5)
    expect(avg0).toBeCloseTo(3.5, 5);

    // With rerolls, average should increase toward max but with diminishing returns
    // For d6, converges to (0+1+2+3+4+5+6)/2 = 5 asymptotically
    expect(avg3).toBeLessThan(6);
    expect(avg3).toBeGreaterThan(avg2);
    expect(avg3).toBeGreaterThan(4.7);
  });

  it('should preserve probability distribution totals', () => {
    const d10 = new NumericDieDefinition({ numSides: 10 });
    const distribution = computeEffectiveDistribution(d10, 5, true);

    let totalProb = 0;
    for (const prob of distribution.values()) {
      totalProb += prob;
    }

    // Total probability should be 1.0 (within floating-point precision)
    expect(totalProb).toBeCloseTo(1.0, 10);
  });

  it('should handle d20 with 2 rerolls correctly', () => {
    const d20 = new NumericDieDefinition({ numSides: 20 });
    const numRerolls = 2;
    const numSimulations = 1500; // Slightly more for d20 (larger sample space)

    const analyticalDist = computeEffectiveDistribution(d20, numRerolls, true);
    const analyticalAvg = calculateAverage(analyticalDist);

    const empiricalDist = simulateSingleDieRerolls(d20, numRerolls, numSimulations);
    const empiricalAvg = calculateAverage(empiricalDist);

    console.log(`\nd20 with 2 rerolls:`);
    console.log(`  Analytical avg: ${analyticalAvg.toFixed(4)}`);
    console.log(`  Empirical avg (${numSimulations} sims): ${empiricalAvg.toFixed(4)}`);
    console.log(`  Difference: ${Math.abs(analyticalAvg - empiricalAvg).toFixed(4)}`);

    const allowedDifference = empiricalAvg * 0.04; // 4% tolerance for d20
    expect(Math.abs(analyticalAvg - empiricalAvg)).toBeLessThan(allowedDifference);
  });

  it('should converge toward maximum value with many rerolls', () => {
    const d6 = new NumericDieDefinition({ numSides: 6 });

    const avg10 = calculateAverage(computeEffectiveDistribution(d6, 10, true));
    const avg20 = calculateAverage(computeEffectiveDistribution(d6, 20, true));

    console.log(`\nd6 convergence:`);
    console.log(`  10 rerolls: ${avg10.toFixed(4)}`);
    console.log(`  20 rerolls: ${avg20.toFixed(4)}`);
    console.log(`  Maximum (6): 6.0000`);

    // With many rerolls, should converge asymptotically toward 5
    expect(avg20).toBeGreaterThan(avg10);
    expect(avg20).toBeGreaterThan(4.99);
    expect(avg20).toBeLessThan(5.01);
  });
});
