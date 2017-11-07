import { Injectable } from '@angular/core';

const SIDE_SUDOKU = 9;
const SIDE_SQUARE = 3;

@Injectable()
export class VerificatorService {

    haveDuplicate(array: number[], value: number): boolean {
        for (let i = 0; i < SIDE_SUDOKU; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }

    isValidRow(row: number, value: number, sudoku: any): boolean {
        let array: number[] = [];
        for (let i = 0; i < SIDE_SUDOKU; i++) {
            array[i] = sudoku[row][i].num;
        }
        return !this.haveDuplicate(array, value);
    }

    isValidColumn(col: number, value: number, sudoku: any): boolean {
        let column: number[] = [];
        for (let i = 0; i < SIDE_SUDOKU; i++) {
            column[i] = sudoku[i][col].num;
        }
        return !this.haveDuplicate(column, value);
    }

    isValidSquare(row: number, col: number, value: number, sudoku: any): boolean {
        let squareY: number = row - row % SIDE_SQUARE;  //square's top coordinates
        let squareX: number = col - col % SIDE_SQUARE;
        let square: number[] = [];
        let it = 0;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                square[it++] = sudoku[squareY + i][squareX + j].num;
            }
        }
        return !this.haveDuplicate(square, value);
    }

    isValidCell(row: number, col: number, value: number, sudoku: any): boolean {
        return this.isValidRow(row, value, sudoku)
            && this.isValidColumn(col, value, sudoku)
            && this.isValidSquare(row, col, value, sudoku);
    }
}
