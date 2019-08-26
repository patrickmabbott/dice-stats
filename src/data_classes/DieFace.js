import { coalesce } from "../utils/GenericFunctions";

/**
 * Details of an individual face of a die.
 * Often, this will just be something like a '4', which is the primary value
 * But, it could have multiple results, like '1 energy and one dollar'
 * As a rule, if this represents some amount of a "primary currency" or expected product of a die roll,
 * just provide a primary value and leave interpretation of what it means to the user.
 */
export default class DieFace {
    constructor({ primaryValue, secondaryValues, name }) {
        this.primaryValue = coalesce(primaryValue, []);
        //If provided, an array of 
        this.secondaryValues = coalesce(secondaryValues, []);
        if(name === undefined && primaryValue !== undefined && primaryValue instanceof 'integer') {
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
            secondaryValues : this.secondaryValues.map( entry => { return entry.clone()}),
            name : this.name
        });
    }
}