import DieDefinition from "./DieDefinition"

/**
 * A die with some count of faces, each of which could represent qualitatively different results.
 * Also, the die of choice for dice with numeric faces but with repeated faces, 
 * non-step increase in numbers etc...
 * This type is hard to optimize and so other types should be preferred where viable.
 */
export default class SymbolicDie extends DieDefinition {
    constructor( { dieFaceCounts, name } ) {
        super( { dieType : 'symbolic', name});
        this.name = name;
        //A map of die face name to DieFaceCount
        this.dieFaceMap = new Map();
        dieFaceCounts.forEach( faceCount => {
            this.dieFaceMap.set(faceCount.definition.name, faceCount);
        });
    }
}