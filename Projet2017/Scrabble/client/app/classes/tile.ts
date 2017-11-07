
const TEN = ['K', 'W', 'X', 'Y', 'Z'];
const EIGHTH = ['J', 'Q'];
const FOUR = ['F', 'H', 'V'];
const THREE = ['B', 'C', 'P'];
const TWO = ['D', 'G', 'M'];

export class Tile {

    letter: string;
    value: number;

    constructor(l: string) {
        this.letter = l;
        this.value = this.getValue(l);
    }

    getValue(l: string): number {
        if (TEN.indexOf(l) > -1) {
            return 10;
        }
        else if (EIGHTH.indexOf(l) > -1) {
            return 8;
        }
        else if (FOUR.indexOf(l) > -1) {
            return 4;
        }
        else if (THREE.indexOf(l) > -1) {
            return 3;
        }
        else if (TWO.indexOf(l) > -1) {
            return 2;
        }
        else if (l === "*") {
            return 0;
        }
        return 1;
    }

    setLetter(letter: string) {
        this.letter = letter;
        this.value = this.getValue(letter);
    }
}
