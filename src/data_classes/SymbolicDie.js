import DieDefinition from "./DieDefinition"
import redImage from '../res/img/red-die.svg';
import blueImage from '../res/img/blue-die.svg';
import whiteImage from '../res/img/perspective-dice-six.svg';

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
        this.dieFaceCounts = dieFaceCounts;
        //A map of die face name to DieFaceCount
        this.dieFaceMap = new Map();
        dieFaceCounts.forEach( faceCount => {
            this.dieFaceMap.set(faceCount.dieFace, faceCount);
        });

        if(!this.image) {
            if(this.name.toLowerCase().includes('red')) {
                this.image = redImage;
            } else if(this.name.toLowerCase().includes('blue')) {
                this.image = blueImage;
            } else {
                this.image = whiteImage;
            }
        }
    }

    
    clone() {
        return new SymbolicDie( {
            dieFaceCounts : Array.from(this.dieFaceMap.values()),
            numSides : this.numSides,
            name : this.name
        });
    }

    /**
     * Performs a single roll, providing a dice face as a result.
     */
    roll() {
        // Choose a face at random.
        //Flatten the face map into an array of die faces, with each face repeated as many times as it occurs.
        const faces = Array.from(this.dieFaceMap.values()).reduce( (accumulator, cur) => {
            for(let i = 0; i < cur.count; i++) {
                accumulator.push(cur.dieFace);
            }
            return accumulator;
        }, []);
        // Choose a face at random.
        return faces[Math.floor(Math.random() * faces.length)];
    }

    /**
     * Enumerates all possible die faces, returning a map of DieFaceCount objects.
     */
    countFaces() {
        return this.dieFaceCounts;
    }

    getNumFaces() {
        return Array.from(this.dieFaceMap.values()).reduce( (accumulator, cur) => {
            return accumulator + cur.count;
        }, 0);
    }

    average() {
        const total = Array.from(this.dieFaceMap.values()).reduce( (accumulator, cur) => {
            return {
                primary: accumulator.primary + cur.dieFace.primaryValue * cur.count,
                secondary: accumulator.secondary + cur.dieFace.secondaryValue * cur.count
            };
        }, { primary : 0, secondary: 0});
        return {
            primary : total.primary / this.getNumFaces(),
            secondary : total.secondary / this.getNumFaces()
        }
    }
}