/**
 * Definition of an individual die, including the various faces that compose it and the count of each face.
 * Assumes each side is equally likely (i.e. a fair die). Note that having more than one copy of a face on different die sides
 * will increase its likelihood proportionally 
 */
export default class DieDefinition {
    constructor( { dieType, explodeThreshold, name, image }) {
        this.dieType = dieType;
        this.name = name;
        this.image = image;
        /**
         * If provided, the die will "explode" when the provided number or higher is rolled,
         * adding the results of the subsequent roll to the one that caused the explosion 
         * (And possibly exploding again). This will typically be only the highest possible result on the die
         * But, there are some games that might have explosions on, say, a 5 or a 6 on a d6.
         */
        
        this.explodeThreshold = explodeThreshold;



        this.clone = this.clone.bind(this);
        this.roll = this.roll.bind(this);
        this.countFaces = this.countFaces.bind(this);
        this.getNumFaces = this.getNumFaces.bind(this);
    }

    clone() {
        return new DieDefinition( { 
            dieType : this.dieType, 
            explodeThreshold : this.explodeThreshold, 
            name : this.name,
            image : this.image
        });
    }

    /**
     * Performs a single roll, providing a dice face as a result.
     */
    roll() {
        //Expecting this to be overridden by subclasses.
        return new Error("Not implemented");
    }

     /**
     * Enumerates all possible die faces, returning an array of DieFaceCount objects.
     */
    countFaces() {
        //TODO: Consider caching this.
        //Expecting this to be overridden by subclasses.
        return new Error("Not implemented");
    }

    /**
     * Enumerates all possible die faces, returning an array of DieFaceCount objects.
     */
    getNumFaces() {
        //If necessary, default is to enumerate faces and return that.
        return Array.from(this.countFaces().values()).reduce( (accumulator, cur) => {
            return accumulator + cur;
        }, 0);
    }

    /**
     * Returns the average result of a single die roll. The result is an object with primary and optional secondary values.
     */
    average() {
        return new Error("Not implemented");
    }
}