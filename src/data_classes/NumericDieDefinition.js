import DieDefinition from "./DieDefinition"
import DieFaceCount from "./DieFaceCount"
import { generateDieResult } from "../utils/StatisticalFunctions";
import DieFace from "./DieFace";
import _ from "lodash"

/**
 * A die with integer faces from some value to some value, in steps of 1.
 */
export default class NumericDieDefinition extends DieDefinition {
    constructor(props) {
        super( { dieType : 'numeric', ...props});
        const { minValue, maxValue, numSides} = props;
        if(numSides) {
            //If the simpler specification (num sides) is provided, assume the min and max is 1 to nSides
            this.minValue = 1;
            this.maxValue = numSides;
        }
        else {
            this.minValue = minValue;
            this.maxValue = maxValue;
        }
        if(props.name === undefined) {
            this.name = `d${this.maxValue}`;
        }
    }

    clone() {
        return new NumericDieDefinition( { 
            minValue : this.minValue,
            maxValue : this.maxValue,
            numSides : this.numSides,
            explodeThreshold : this.explodeThreshold, 
            name : this.name
        });
    }

    /**
     * Performs a single roll, providing a dice face as a result.
     */
    roll() {
        const result = generateDieResult(this.minValue, this.maxValue);
        return new DieFace({ primaryValue : result});
    }

     /**
     * Enumerates all possible die faces, returning a map of DieFaceCount objects.
     */
    enumerateFaces() {
        const diceCounts = new Map();
        return _.range(this.minValue.this.maxValue).forEach ( value => {
            const face = new DieFace({ primaryValue : value});
            if(diceCounts.has(face.name)) {
                diceCounts.get(diceCounts).count++;
            }
            else {
                diceCounts.set(face.name, new DieFaceCount({ dieFace : face, count : 1}));
            }
        })
    }
}