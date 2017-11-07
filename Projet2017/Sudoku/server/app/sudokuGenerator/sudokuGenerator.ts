import { SudokuValidator } from '../sudokuValidator/sudokuValidator';

const LIMIT_MAX = 8;
const LIMIT_MIN = 0;
const OPERATION_MULTIPLIER = 5;
const LIMIT_MIN_EASY = 20;
const LIMIT_MAX_EASY = 30;
const LIMIT_MIN_HARD = 40;
const LIMIT_MAX_HARD = 50;

export class SudokuGenerator {

    validator: SudokuValidator;
    constructor() {
        this.validator = new SudokuValidator();
    }

    deepCopy(array: number[][]): number[][] {
        let copy: number[][] = [];
        for (let i = 0; i < array.length; i++) {
            copy[i] = [];
        }

        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length; j++) {
                copy[i][j] = array[i][j];
            }
        }
        return copy;
    }

    changeColumns(array: number[][]) {

        let copy = this.deepCopy(array);
        let col1 = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
        let col2: number;
        let max: number;
        let min: number;

        if (col1 === 0 || col1 === 3 || col1 === 6) {
            max = col1 + 2;
            min = col1 + 1;
            col2 = Math.floor(Math.random() * (max - min + 1) + min);
        }
        else if (col1 === 2 || col1 === 5 || col1 === 8) {
            max = col1 - 1;
            min = col1 - 2;
            col2 = Math.floor(Math.random() * (max - min + 1) + min);
        }
        else {
            let temp = col1;
            while (temp === col1) {
                max = col1 + 1;
                min = col1 - 1;
                temp = Math.floor(Math.random() * (max - min + 1) + min);
            }
            col2 = temp;
        }

        for (let i = 0; i < copy.length; i++) {
            array[i][col1] = copy[i][col2];
            array[i][col2] = copy[i][col1];
        }

    }

    changeRows(array: number[][]) {

        let copy = this.deepCopy(array);
        let row1 = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
        let row2: number;
        let max: number;
        let min: number;

        if (row1 === 0 || row1 === 3 || row1 === 6) {
            max = row1 + 2;
            min = row1 + 1;
            row2 = Math.floor(Math.random() * (max - min + 1) + min);
        }
        else if (row1 === 2 || row1 === 5 || row1 === 8) {
            max = row1 - 1;
            min = row1 - 2;
            row2 = Math.floor(Math.random() * (max - min + 1) + min);
        }
        else {
            let temp = row1;
            while (temp === row1) {
                max = row1 + 1;
                min = row1 - 1;
                temp = Math.floor(Math.random() * (max - min + 1) + min);
            }
            row2 = temp;
        }

        for (let j = 0; j < copy.length; j++) {
            array[row1][j] = copy[row2][j];
            array[row2][j] = copy[row1][j];
        }

    }

    horizontalSymmetry(array: number[][]) {
        let copy = this.deepCopy(array);

        for (let i = copy.length - 1; i >= 0; i--) {
            for (let j = 0; j < copy.length; j++) {
                array[copy.length - 1 - i][j] = copy[i][j];
            }
        }
    }

    verticalSymmetry(array: number[][]) {
        let copy = this.deepCopy(array);

        for (let i = 0; i < copy.length; i++) {
            for (let j = copy.length - 1; j >= 0; j--) {
                array[i][copy.length - 1 - j] = copy[i][j];
            }
        }
    }

    diagonalSymmetry(array: number[][]) {
        let copy = this.deepCopy(array);

        for (let i = 0; i < copy.length; i++) {
            for (let j = 0; j < copy.length; j++) {
                array[j][i] = copy[i][j];
            }
        }
    }

    eraseNumbers(dificulty: string, array: number[][]) {

        let cellToErase: number;
        let row: number = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
        let col: number = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);

        if (dificulty === 'facile') {
            cellToErase = Math.floor(Math.random() * (LIMIT_MAX_EASY - LIMIT_MIN_EASY) + LIMIT_MIN_EASY);
        }
        else {
            cellToErase = Math.floor(Math.random() * (LIMIT_MAX_HARD - LIMIT_MIN_HARD) + LIMIT_MIN_HARD);
        }

        while (cellToErase > 0) {
            row = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
            col = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
            while (array[row][col] === 0) {
                row = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
                col = Math.floor(Math.random() * (LIMIT_MAX - LIMIT_MIN + 1) + LIMIT_MIN);
            }

            let erasedNumber: number = array[row][col];
            array[row][col] = 0;

            if (this.validator.solve(0, 0, array, 0) !== 1) {
                array[row][col] = erasedNumber;
            }
            else {
                cellToErase--;
            }
        }
    }

    createSudoku(difficulty: string): any {

        let sudoku = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];


        let opNum: number = Math.floor(Math.random() * (LIMIT_MAX_EASY - LIMIT_MIN_EASY + 1) + LIMIT_MAX_EASY);
        let op: number;
        let solution: number[][];

        while (opNum > 0) {
            op = Math.floor(Math.random() * OPERATION_MULTIPLIER);

            switch (op) {
                case 0:
                    this.changeColumns(sudoku);
                    break;
                case 1:
                    this.changeRows(sudoku);
                    break;
                case 2:
                    this.verticalSymmetry(sudoku);
                    break;
                case 3:
                    this.diagonalSymmetry(sudoku);
                    break;
                case 4:
                    this.horizontalSymmetry(sudoku);
            }
            opNum--;
        }

        solution = this.deepCopy(sudoku);

        this.eraseNumbers(difficulty, sudoku);
        return { empty: sudoku, solution: solution };
    }

}

/*
let tableauInitial = [
[1, 2, 3, 4, 5, 6, 7, 8, 9],
[4, 5, 6, 7, 8, 9, 1, 2, 3],
[7, 8, 9, 1, 2, 3, 4, 5, 6],
[2, 3, 4, 5, 6, 7, 8, 9, 1],
[5, 6, 7, 8, 9, 1, 2, 3, 4],
[8, 9, 1, 2, 3, 4, 5, 6, 7],
[3, 4, 5, 6, 7, 8, 9, 1, 2],
[6, 7, 8, 9, 1, 2, 3, 4, 5],
[9, 1, 2, 3, 4, 5, 6, 7, 8]];
let test = new SudokuGenerator();

test.eraseNumbers("difficile", tableauInitial);

test.validator.printGrille(tableauInitial);
*/
