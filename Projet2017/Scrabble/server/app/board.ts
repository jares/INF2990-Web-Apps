import { Tile } from './tile';

const BOARD_SIZE = 15;


export class Board {

    private board: Tile[][];             //Plateau de jeu contenant les lettres jouées

    constructor() {
        this.board = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            this.board[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                this.board[i][j] = null;
            }
        }
    }

    getCell(i: number, j: number): string {
        if (this.board[i][j] !== null) {
            return this.board[i][j].letter;
        }
        return null;
    }

    /*
    Prend en paramètres les coordonnées d'une lettre et
    retourne le mot vertical dont la lettre fait partie
    -i: index de la rangée
    -j: index de la colonne
     */
    getWordFromColumn(i: number, j: number): any {
        let word = "";
        let tiles: Tile[] = [];
        let k = 0;
        let y = 0;

        //Recule jusqu'à trouver le début du mot
        while (i - k >= 0 && this.board[i - k][j] !== null) {
            word = this.board[i - k][j].letter + word;
            tiles.unshift(this.board[i - k][j]);
            k++;
        }
        y = i - k + 1;
        k = 1;

        //Avance jusqu'à trouver la fin du mot
        while (i + k < BOARD_SIZE && this.board[i + k][j] !== null) {
            word += this.board[i + k][j].letter;
            tiles.push(this.board[i + k][j]);
            k++;
        }
        return { i: y, j: j, word: word, tiles: tiles };
    }

    /*
    Prend en paramètres les coordonnées d'une lettre et
    retourne le mot horizontal dont la lettre fait partie
    -i: index de la rangée
    -j: index de la colonne
     */
    getWordFromRow(i: number, j: number): any {
        let word = "";
        let tiles: Tile[] = [];
        let k = 0;
        let x = 0;

        //Recule jusqu'à trouver le début du mot
        while (j - k >= 0 && this.board[i][j - k] !== null) {
            word = this.board[i][j - k].letter + word;
            tiles.unshift(this.board[i][j - k]);
            k++;
        }
        x = j - k + 1;
        k = 1;

        //Avance jusqu'à trouver la fin du mot
        while (j + k < BOARD_SIZE && this.board[i][j + k] !== null) {
            word += this.board[i][j + k].letter;
            tiles.push(this.board[i][j + k]);
            k++;
        }

        return { i: i, j: x, word: word, tiles: tiles };
    }

    /*
    Vérifie si le plateau contient la place nécéssaire pour ajouter les lettres voulues
    Retourne false si les lettres dépassent le bord ou passe par dessus des lettres existantes
    -coordinates: les coordonnées de la première lettre du mot
    -word: le mot à placer
     */
    hasRoom(coordinates: any, word: string): boolean {
        let orientation = coordinates.orientation;
        let i = coordinates.i;
        let j = coordinates.j;

        if (orientation === 'V') {
            if (i + word.length > BOARD_SIZE) {
                return false;
            }
            for (let row = 0; row < word.length; row++) {
                if (this.board[i + row][j] !== null && this.board[i + row][j].letter !== word[row]) {
                    return false;
                }
            }
        } else {
            if (j + word.length > BOARD_SIZE) {
                return false;
            }
            for (let col = 0; col < word.length; col++) {
                if (this.board[i][j + col] !== null && this.board[i][j + col].letter !== word[col]) {
                    return false;
                }
            }
        }
        return true;
    }

    /*
    Vérifie dans si le mot placé passe sur la case centrale
    Retourne true si c'est le cas
    -coordinates: coordonnées de la première lettre de mot
    -length: longueur du mot
     */
    checkIfOnCenter(coordinates: any, length: number): boolean {
        if (coordinates.orientation === 'V' && coordinates.j === 7) {
            for (let row = 0; row < length; row++) {
                if (coordinates.i + row === 7) {
                    return true;
                }
            }
        }
        else if (coordinates.orientation === 'H' && coordinates.i === 7) {
            for (let col = 0; col < length; col++) {
                if (coordinates.j + col === 7) {
                    return true;
                }
            }
        }
        return false;
    }

    checkSurroundingCells(i: number, j: number): boolean {
        if (i - 1 >= 0 && this.board[i - 1][j] !== null) {
            return true;
        }
        else if (i + 1 < BOARD_SIZE && this.board[i + 1][j] !== null) {
            return true;
        }
        else if (j - 1 >= 0 && this.board[i][j - 1] !== null) {
            return true;
        }
        else if (j + 1 < BOARD_SIZE && this.board[i][j + 1] !== null) {
            return true;
        }
        return false;
    }

    /*
    Vérifie autour du mot s'il touche à des lettres existantes
    Retourne true si c'est le cas
    -coordinates: coordonnées de la première lettre de mot
    -word: le mot placé
     */
    isTouchingLetters(coordinates: any, length: number): boolean {
        let orientation = coordinates.orientation;
        let i = coordinates.i;
        let j = coordinates.j;
        let n = 0;

        console.log("checking cell", i, j, "in orientation", orientation, "and more for length", length);

        while (n < length) {
            if (this.checkSurroundingCells(i, j)) {
                return true;
            }
            if (orientation === 'V') {
                i++;
            }
            else if (orientation === 'H') {
                j++;
            }
            n++;
        }
        return false;
    }

    /*
    Ajoute la lettre sur le plateau de jeu
    -i: index de la rangée
    -j: index de la colonne
    -letter: lettre à ajouter
     */
    addTile(i: number, j: number, tile: Tile) {
        this.board[i][j] = tile;
    }

    /*
    Enlève la lettre du plateau de jeu
    -i: index de la rangée
    -j: index de la colonne
     */
    removeLetter(i: number, j: number) {
        this.board[i][j] = null;
    }
}
