import DieDefinition from "./DieDefinition"
import DieFaceCount from "./DieFaceCount"
import { generateDieResult } from "../utils/StatisticalFunctions";
import DieFace from "./DieFace";
import _ from "lodash"
import d4Image from '../res/img/d4.svg';
import d6Image from '../res/img/perspective-dice-six.svg';
import d8Image from '../res/img/dice-eight-faces-eight.svg';
import d10Image from '../res/img/d10.svg';
import d12Image from '../res/img/d12.svg';
import d20Image from '../res/img/dice-twenty-faces-twenty.svg';
import genericDiceImage from '../res/img/rolling-dices.svg'

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

        if(!this.image) {
            switch(this.maxValue) {
                case 4:
                    this.image = d4Image;
                    break;
                case 6:
                    this.image = d6Image;
                    break;
                case 8:
                    this.image = d8Image;
                    break;
                case 10:
                case 100:
                    this.image = d10Image;
                    break;
                case 12:
                    this.image = d12Image;
                    break;
                case 20:
                    this.image = d20Image;
                    break;
                default:
                    this.image = genericDiceImage;
                    break;
            }
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
    countFaces() {
        const diceCounts = new Map();
        _.range(this.minValue, this.maxValue + 1).forEach ( value => {
            const face = new DieFace({ primaryValue : value});
            if(diceCounts.has(face.name)) {
                diceCounts.get(face.name).count++;
            }
            else {
                diceCounts.set(face.name, new DieFaceCount({ dieFace : face, count : 1}));
            }
        })
        return diceCounts;
    }

    getNumFaces() {
        return this.maxValue - this.minValue + 1;
    }

    average() {
        return {
            primary: (this.minValue + this.maxValue) / 2,
            secondary: 0
        };
    }
}