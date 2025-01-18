import { coalesce } from "../utils/GenericFunctions";

/**
 * Details of an individual face of a die.
 * Often, this will just be something like a '4', which is the primary value
 * But, it could have multiple results, like '1 energy and one dollar'
 * For the sake of simplicity, only one primary and one secondary value type are supported within a given die pool.
 * As a rule, if this represents some amount of a "primary currency" or expected product of a die roll,
 * just provide a primary value and leave interpretation of what it means to the user.
 */
export default class DieFace {
    constructor({ primaryValue, secondaryValue, name }) {
        this.primaryValue = coalesce(primaryValue, 0);
        //If provided, an array of 
        this.secondaryValue = coalesce(secondaryValue, 0);
        if(name === undefined && 
            primaryValue !== undefined) {
            this.name = primaryValue.toString();
        }
        else {
            this.name = name;
        }

        this.clone = this.clone.bind(this);
    }

    clone() {
        return new DieFace( { 
            primaryValue : this.primaryValue,
            secondaryValue : this.secondaryValue,
            name : this.name
        });
    }
}