import DieFace from "./DieFace";

/**
 * Simple tuple-like definition for tracking the count of certain die faces.
 */
export default class DieFaceCount {
    constructor(dieFace, count) {
        this.dieFace = dieFace;
        this.count = count;

        this.clone = this.clone.bind(this);
    }

    clone() {
        return new DieFace( { 
            dieFace : this.dieFace.clone(),
            count : this.count
        });
    }
}