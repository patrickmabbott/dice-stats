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
        this.enumerateFaces = this.enumerateFaces.bind(this);
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
        return new Error("Not implemented");
    }

     /**
     * Enumerates all possible die faces, returning an array of DieFaceCount objects.
     */
    enumerateFaces() {
        //TODO: Consider caching this.
        return new Error("Not implemented");
    }
}