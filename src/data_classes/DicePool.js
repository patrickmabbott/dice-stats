import { coalesce } from "../utils/GenericFunctions";
import DiceCount from "./DiceCount"

export default class DicePool {
    constructor({ diceCounts, staticBonus, staticSecondaryBonuses, name }) {
        this.staticBonus = coalesce(staticBonus, 0);
        this.staticSecondaryBonuses = staticSecondaryBonuses;
        this.name = name;
        this.diceCounts = diceCounts.slice();
        this.addDice = this.addDice.bind(this);
        this.removeDice = this.removeDice.bind(this);
        this.clone = this.clone.bind(this);
    }

    addDice(dieDefinition, count) {
        count = coalesce(count, 1);
        const associatedEntry = this.diceCounts.find( entry => entry.name === dieDefinition.name);
        const newCount = (associatedEntry ? associatedEntry.count : 0)  + count;
        if(associatedEntry) {
            associatedEntry.count++;
        }
        else {
            this.diceCounts.push(new DiceCount({ name : dieDefinition.name, count : newCount}));
        }
    }

    removeDice(dieDefinition, count) {
        const associatedEntry = this.diceCounts.find( entry => entry.name === dieDefinition.name);
        const newCount = (associatedEntry ? associatedEntry.count : 0)  - count;
        if(associatedEntry) {
            associatedEntry.count = newCount;
        }
        else {
            this.diceCounts.push(new DiceCount({ name : dieDefinition.name, count : newCount}));
        }
    }

    clone() {
        const diceCounts = this.diceCounts.map( entry => {
            return entry.clone();
        }
        );
        return new DicePool({
            diceCounts,
            staticBonus : this.staticBonus,
            staticSecondaryBonuses : this.staticSecondaryBonuses,
            name : this.name
        });
    }
}