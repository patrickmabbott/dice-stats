import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createMapStorage } from './persistMiddleware';
import {
  initializeDicePools,
  produceResultsSemiIterative,
  estimateAverage
} from './diceInitializer';
import { coalesce } from '../utils/GenericFunctions';

const useDiceStore = create(
  persist(
    (set, get) => {
      const { diceDefinitions, dicePools, currentName } = initializeDicePools();

      return {
        // --- Dice Pool Slice ---
        dicePools,
        currentDicePool: dicePools.get(currentName).clone(),

        addDie: (definition, count) => {
          set(state => {
            const updated = state.currentDicePool.clone();
            updated.addDice(definition, count);
            return { currentDicePool: updated };
          });
          get().recalculate();
        },

        removeDie: (definition, count) => {
          set(state => {
            const updated = state.currentDicePool.clone();
            updated.removeDice(definition, Math.abs(count));
            return { currentDicePool: updated };
          });
          get().recalculate();
        },

        saveCurrentPool: (newPoolName) => {
          set(state => {
            const poolCopy = state.currentDicePool.clone();
            poolCopy.name = newPoolName;
            const updatedPools = new Map(state.dicePools);
            updatedPools.set(newPoolName, poolCopy);
            return { dicePools: updatedPools, currentDicePool: poolCopy };
          });
        },

        setCurrentPool: (poolName) => {
          const pool = get().dicePools.get(poolName);
          if (coalesce(poolName, '') === '' || !pool) {
            console.error(`Could not find requested pool by name ${poolName}`);
            return;
          }
          set({ currentDicePool: pool.clone() });
          get().recalculate();
        },

        clearCounts: () => {
          set(state => {
            const updated = state.currentDicePool.clone();
            updated.diceCounts = updated.diceCounts.map(entry => {
              const copy = entry.clone();
              copy.count = 0;
              return copy;
            });
            return { currentDicePool: updated };
          });
        },

        // --- Dice Definition Slice ---
        definitions: diceDefinitions,

        // --- Statistics Slice ---
        isCalculationCurrent: false,
        primaryProbabilities: new Map(),
        secondaryProbabilities: new Map(),
        cumulativePrimaryProbabilities: new Map(),
        cumulativeSecondaryProbabilities: new Map(),
        averages: { primary: 0, secondary: 0 },
        mode: 'cumulative',
        maxProbabilityEntriesToShow: 20,

        recalculate: () => {
          const {
            currentDicePool,
            definitions,
            skipAccumulatedProbOfOneHundredPercent
          } = get();

          const { primaryProbabilities, secondaryProbabilities } =
            produceResultsSemiIterative(currentDicePool, definitions);

          if (!primaryProbabilities) {
            set({
              primaryProbabilities: new Map(),
              secondaryProbabilities: new Map(),
              cumulativePrimaryProbabilities: new Map(),
              cumulativeSecondaryProbabilities: new Map(),
              averages: { primary: 0, secondary: 0 },
              isCalculationCurrent: true
            });
            return;
          }

          const averages = estimateAverage(currentDicePool, definitions);

          const deriveCumulativeProbabilities = probabilities => {
            const orderedResults = Array.from(probabilities.keys())
              .sort((a, b) => {
                if (a < b) {
                  return -1;
                } else if (a > b) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .reverse();

            const cumulativeProbabilities = new Map();

            orderedResults.reduce((accumulatedProbability, curResult) => {
              const curResultProbability = probabilities.get(curResult);
              const newAccumulatedProbability = curResultProbability + accumulatedProbability;
              if (skipAccumulatedProbOfOneHundredPercent && newAccumulatedProbability < 1) {
                cumulativeProbabilities.set(curResult, newAccumulatedProbability);
              }
              return newAccumulatedProbability;
            }, 0);
            return cumulativeProbabilities;
          };

          const cumulativePrimaryProbabilities = deriveCumulativeProbabilities(
            primaryProbabilities
          );
          const cumulativeSecondaryProbabilities = deriveCumulativeProbabilities(
            secondaryProbabilities
          );

          set({
            primaryProbabilities,
            secondaryProbabilities,
            cumulativePrimaryProbabilities,
            cumulativeSecondaryProbabilities,
            averages,
            isCalculationCurrent: true
          });
        },

        setMode: mode => set({ mode }),

        // --- Options Slice ---
        skipAccumulatedProbOfOneHundredPercent: true
      };
    },
    {
      name: 'dice-pool-storage',
      storage: createMapStorage(),
      partialize: state => ({
        dicePools: state.dicePools,
        currentDicePool: state.currentDicePool
      })
    }
  )
);

export default useDiceStore;
