import NumericDieDefinition from "./NumericDieDefinition";
import { generateDieResult } from "../utils/StatisticalFunctions";
import DieFace from "./DieFace"
import DieFaceCount from "./DieFaceCount";

/**
 * A typical numeric die (i.e. a d8) that doesn't return 1, 2, 3, 4 etc... but rather
 * returns 1 if the basic result is equal to or above a threshold. i.e. 7 or 8 gives 1, otherwise 0.
 * (Note that it is possible to represent a die with multiple thresholds. 
 * i.e. 3 faces give 0, 2 faces give 1, and one face gives 2. 
 * But, that is currently being handled by Symbolic Die) 
 */
export default class ThresholdDieDefinition extends NumericDieDefinition {
    constructor(props) {
        super(props);
        const { threshold } = props;
        this.threshold = threshold;
        this.clone = this.clone.bind(this);
    }

    clone() {
        return new ThresholdDieDefinition( { 
            minValue : this.minValue,
            maxValue : this.maxValue,
            numSides : this.numSides,
            explodeThreshold : this.explodeThreshold, 
            name : this.name,
            threshold : this.threshold
        });
    }

    roll() {
        const numericRoll = generateDieResult(this.minValue, this.maxValue);
        const result = numericRoll >= this.threshold ? 1 : 0;
        return new DieFace({ primaryValue : result, name : result === 1 ? 'Success' : 'Failure'});
    }

    countFaces() {
        const diceCounts = new Map();

        const numFacesReachingThreshold = this.maxValue - this.threshold + 1;
        const numFacesBelowThreshold = this.threshold - this.minValue;

        const faceReachingThreshold = new DieFace({ primaryValue : 1, name: 'Success'});
        const faceNotReachingThreshold = new DieFace({ primaryValue : 0, 'name': 'Failure'});

        diceCounts.set(faceReachingThreshold.name, new DieFaceCount({ count: numFacesReachingThreshold, dieFace: faceReachingThreshold}));
        diceCounts.set(faceNotReachingThreshold.name, new DieFaceCount({ count: numFacesBelowThreshold, dieFace: faceNotReachingThreshold}));
        return diceCounts;
    }

    average() {
        const faces = this.countFaces();
        return {
            primary: faces.get('Success').count / this.getNumFaces(),
            secondary: 0
        };
    }
}