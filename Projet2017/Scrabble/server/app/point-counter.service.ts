import { Tile } from './tile';

// const AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
const TEN_POINTS = ['K', 'W', 'X', 'Y', 'Z'];
const EIGHT_POINTS = ['J', 'Q'];
const FOUR_POINTS = ['F', 'H', 'V'];
const THREE_POINTS = ['B', 'C', 'P'];
const TWO_POINTS = ['D', 'G', 'M'];
const ONE_POINT = ['A', 'E', 'I', 'L', 'N', 'O', 'R', 'S', 'T', 'U'];

export class PointCounter {

    word3x = ['A1', 'H1', 'O1', 'A8', 'O8', 'A15', 'H15', 'O15'];
    word2x = ['B2', 'C3', 'D4', 'E5', 'K5', 'L4', 'M3', 'N2', 'B14',
                'C13', 'D12', 'E11', 'K11', 'L12', 'M13', 'N14', 'H8'];
    letter2x = ['D1', 'L1', 'G3', 'I3', 'A4', 'H4', 'O4', 'C7', 'G7', 'I7', 'M7', 'D8',
                'L8', 'C9', 'G9', 'I9', 'M9', 'A12', 'H12', 'O12', 'G13', 'I13', 'D15', 'L15'];
    letter3x = ['F2', 'J2', 'B6', 'F6', 'J6', 'N6', 'B10', 'F10', 'J10', 'N10', 'F14', 'J14'];

    /*
    Trouve le score total d'un mot joué selon sa position
    en appliquant les bonus de lettres et de mots
    -coordinates: les coordonnées de la première lettre du mot et son orientation
    -wordPlayed: le mot joué
     */
    getScore(coordinates: any, wordPlayed: Tile[]): number {
        let i = coordinates.i;
        let j = coordinates.j;
        let score = 0;
        let wordMultiplier = 1; //Multiplication des points du mot

        for (let k = 0; k < wordPlayed.length; k++) {
            let bonus = this.getMultiplierFromCoordinates(i, j);
            score += wordPlayed[k].value * bonus.l;
            wordMultiplier *= bonus.w;

            if (coordinates.orientation === 'H') {
                j++;
            } else if (coordinates.orientation === 'V') {
                i++;
            }
        }
        return score *= wordMultiplier;
    }

    /*
    Retourne le bonus multiplicateur de mot ou lettre
    selon les coordonnées de la case
    -i: index de la rangée
    -j: index de la colonne
     */
    getMultiplierFromCoordinates(i: number, j: number): any {
        let cell = this.getCellFromCoordinates(i, j);
        console.log("Verifying multiplier on cell", cell);

        if (this.word3x.indexOf(cell) > -1) {
            console.log(cell, "has a 3x word multiplier");
            return { w: 3, l: 1 };
        }
        else if (this.word2x.indexOf(cell) > -1) {
            console.log(cell, "has a 2x word multiplier");
            return { w: 2, l: 1 };
        }
        else if (this.letter2x.indexOf(cell) > -1) {
            console.log(cell, "has a 2x letter multiplier");
            return { w: 1, l: 2 };
        }
        else if (this.letter3x.indexOf(cell) > -1) {
            console.log(cell, "has a 3x letter multiplier");
            return { w: 1, l: 3 };
        }
        return { w: 1, l: 1 };
    }

    /*
    Enlève les bonus multiplicateur de toutes les nouvelles cases du tour
    -newLetters: tableau des lettres jouées au tour
     */
    clearMultipliers(newLetters: any) {
        for (let k = 0; k < newLetters.length; k++) {
            let cell = this.getCellFromCoordinates(newLetters[k].i, newLetters[k].j);
            this.removeMultiplier(cell);
        }
    }

    /*
    Retourne le nom de la case, ex: A3, D7, K13, ...
    -i: index de la rangée
    -j: index de la colonne
     */
    getCellFromCoordinates(i: number, j: number): string {
        return String.fromCharCode(i + 65) + String(j + 1);
    }

    /*
    Trouve la valeur associé à la lettre
    -l: la lettre
     */
    findValue(l: string): number {
        if (TEN_POINTS.indexOf(l) > -1) {
            return 10;
        }
        else if (EIGHT_POINTS.indexOf(l) > -1) {
            return 8;
        }
        else if (FOUR_POINTS.indexOf(l) > -1) {
            return 4;
        }
        else if (THREE_POINTS.indexOf(l) > -1) {
            return 3;
        }
        else if (TWO_POINTS.indexOf(l) > -1) {
            return 2;
        }
        else if (ONE_POINT.indexOf(l) > -1) {
            return 1;
        }

        return 0;
    }

    /*
    Enlève le bonus multiplicateur de la case
    Utilisé afin d'éviter que le score d'un mot soit affecté par les bonus
    de cases jouées dans des tour précédents
    -cell: le nom de la case, ex: H8, B12, O2, ...
     */
    removeMultiplier(cell: string) {
        if (this.word3x.indexOf(cell) > -1) {
            this.word3x.splice(this.word3x.indexOf(cell), 1);
        }
        else if (this.word2x.indexOf(cell) > -1) {
            this.word2x.splice(this.word2x.indexOf(cell), 1);
        }
        else if (this.letter2x.indexOf(cell) > -1) {
            this.letter2x.splice(this.letter2x.indexOf(cell), 1);
        }
        else if (this.letter3x.indexOf(cell) > -1) {
            this.letter3x.splice(this.letter3x.indexOf(cell), 1);
        }
    }
}
