const SIDE_SUDOKU = 9;
const SIDE_SQUARE = 3;

export class SudokuValidator {

    valueToVerify: number;

    solve(i: number, j: number, array: number[][], solutionsCount: number): number {
        if (i === 9) {
            i = 0;
            if (++j === 9) {
                return 1 + solutionsCount;
            }
        }

        if (array[i][j] !== 0) {
            return this.solve(i + 1, j, array, solutionsCount);
        }
        else {
            for (let val = 1; val < 10 && solutionsCount < 2; ++val) {
                if (this.isValidMove(i, j, array, val)) {
                    array[i][j] = val;
                    solutionsCount = this.solve(i + 1, j, array, solutionsCount);
                }
                array[i][j] = 0;
            }

            return solutionsCount;
        }

    }

    isValidMove(i: number, j: number, array: number[][], num: number): boolean {
        if (array[i][j] !== 0) {  //si il y a deja un numero dans la case, le coup n'est pas valide
            return false;
        }

        array[i][j] = num;
        let estValide: boolean = this.isValidSudoku(array);
        array[i][j] = 0;
        return estValide;
    }

    haveNumber(arr: number[], num: number) {

        for (let i = 0; i < SIDE_SUDOKU; i++) {
            if (arr[i] === num) {
                return true;
            }
        }

        return false;
    }

    haveDuplicate(arr: number[]): boolean {

        let temp: number[] = [];
        for (let j = 0; j < SIDE_SUDOKU; j++) {
            temp[j] = arr[j];
        }

        temp.sort();

        let i = 0;
        while (temp[i] === 0) {    //passe tous les 0, aka les cases vides
            i++;
        }

        let last: number = temp[i];
        i++;

        for (i; i < SIDE_SUDOKU; i++) {
            if (temp[i] === last) {  //verifie si deux numeros pareils sont
                return true;
            }
            else {
                last = temp[i];
            }
        }
        return false;
    }

    areValidRows(array: number[][]): boolean {
        for (let row = 0; row < SIDE_SUDOKU; row++) {
            if (this.haveDuplicate(array[row])) {
                return false;
            }
        }
        return true;
    }

    isValidRow(array: number[][], row: number): boolean {
        // console.log(this.haveNumber(array[rang], valeur));
        if (this.haveNumber(array[row], this.valueToVerify)) {
            return false;
        }

        return true;
    }

    areValidColumns(array: number[][]): boolean {
        for (let col = 0; col < SIDE_SUDOKU; col++) {
            let temp: number[] = [];
            for (let i = 0; i < SIDE_SUDOKU; i++) {
                temp[i] = array[i][col];
            }
            if (this.haveDuplicate(temp)) {
                return false;
            }
        }
        return true;
    }

    isValidColumn(array: number[][], col: number): boolean {
        let column: number[] = [];
        for (let i = 0; i < SIDE_SUDOKU; i++) {
            column[i] = array[i][col];
        }
        if (this.haveNumber(column, this.valueToVerify)) {
            return false;
        }
        return true;
    }

    areValidSquares(array: number[][]): boolean {
        for (let i = 0; i < SIDE_SUDOKU; i++) {
            let square: number[] = [];
            for (let j = 0; j < SIDE_SUDOKU; j++) {
                let row = (Math.floor(i / SIDE_SQUARE) * SIDE_SQUARE + Math.floor(j / SIDE_SQUARE));
                let col = i * SIDE_SQUARE % SIDE_SUDOKU + j % SIDE_SQUARE;
                square[j] = array[row][col];
            }
            if (this.haveDuplicate(square)) {
                return false;
            }
        }
        return true;
    }

    isValidSquare(array: number[][], range: number, col: number): boolean {
        let squareY: number = (range - range % SIDE_SQUARE); //coordonnées du coin haut gauche du carré
        let squareX: number = (col - col % SIDE_SQUARE);

        let square: number[] = [];  //tableau 1D contenant les chiffres
        let it = 0;

        for (let k = 0; k < SIDE_SQUARE; k++) {
            for (let l = 0; l < SIDE_SQUARE; l++) {
                square[it++] = array[squareY + k][squareX + l];
            }
        }
        if (this.haveNumber(square, this.valueToVerify)) {
            return false;
        }

        return true;

    }

    isValidSudoku(array: number[][]) {
        return this.areValidSquares(array) &&
            this.areValidColumns(array) &&
            this.areValidRows(array);
    }

}
/*
let val = new ValidatorSudoku();

let tableau = [
            [0, 2, 3, 4, 5, 0, 7, 0, 9],
            [4, 0, 6, 0, 8, 0, 1, 0, 0],
            [7, 8, 0, 0, 2, 0, 4, 0, 6],
            [2, 0, 4, 0, 0, 7, 0, 9, 0],
            [5, 6, 7, 8, 0, 0, 2, 0, 4],
            [8, 0, 1, 0, 3, 0, 5, 0, 7],
            [0, 4, 0, 6, 7, 8, 0, 0, 2],
            [6, 0, 8, 0, 1, 0, 3, 4, 5],
            [9, 1, 0, 3, 0, 5, 6, 7, 0]];

val.solve(0, 0, tableau, 0);
*/
