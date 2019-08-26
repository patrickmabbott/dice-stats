import { coalesce } from "../utils/GenericFunctions";

export default class DicePool {
    constructor({ diceCounts, staticBonus, staticSecondaryBonuses, name }) {
        this.staticBonus = coalesce(staticBonus, 0);
        this.staticSecondaryBonuses = staticSecondaryBonuses;
        this.name = name;
        this.diceCounts = new Map(diceCounts);
        this.addDice = this.addDice.bind(this);
        this.removeDice = this.removeDice.bind(this);
        this.clone = this.clone.bind(this);
    }

    addDice(dieDefinition, count) {
        count = coalesce(count, 1);
        const newCount = coalesce(this.diceCounts.get(dieDefinition.name), 0) + count;
        this.diceCounts.set(dieDefinition.name, newCount);
    }

    removeDice(dieDefinition, count) {
        count = coalesce(count, 1);
        const newCount = coalesce(this.diceCounts.get(dieDefinition.name), 0) - count;
        //If less than 0, remove it.
        if(newCount < 0) {
            this.diceCounts.delete(dieDefinition.name);
        }
        else {
            this.diceCounts.set(dieDefinition.name, newCount);
        }
    }

    clone() {
        const diceCounts = new Map(this.diceCounts);
        return new DicePool({
            diceCounts,
            staticBonus : this.staticBonus,
            staticSecondaryBonuses : this.staticSecondaryBonuses,
            name : this.name
        });
    }
}