import { coalesce } from "../utils/GenericFunctions";

/**
 * Simple value class that pairs a die definition name and its count (within a pool).
 */
export default class DieCount {
    constructor({ name, count }) {
        this.name = name;
        this.count = count;

        this.clone = this.clone.bind(this);
    }

    clone() {
        return new DieCount( { 
            name : this.name,
            count : this.count
        });
    }
}