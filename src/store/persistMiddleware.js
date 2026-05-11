import DicePool from '../data_classes/DicePool';

export const createMapStorage = () => ({
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;

    const parsed = JSON.parse(str);

    if (parsed.state.dicePools) {
      parsed.state.dicePools = new Map(
        parsed.state.dicePools.map(pool => [pool.name, DicePool.fromJSON(pool)])
      );
    }

    if (parsed.state.currentDicePool) {
      parsed.state.currentDicePool = DicePool.fromJSON(parsed.state.currentDicePool);
    }

    return parsed;
  },

  setItem: (name, value) => {
    const toStore = {
      ...value,
      state: {
        ...value.state,
        dicePools: Array.from(value.state.dicePools.values())
          .filter(pool => !pool.isBaseline)
      }
    };
    localStorage.setItem(name, JSON.stringify(toStore));
  },

  removeItem: (name) => localStorage.removeItem(name)
});
