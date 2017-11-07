import { expect } from 'chai';
import { SudokuGenerator } from './sudokuGenerator.js';

describe('Sudoku tests', () => {

    it('Inversion symétrique par rapport à la colonne du milieu', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let expectedArray = [
            [9, 8, 7, 6, 5, 4, 3, 2, 1],
            [3, 2, 1, 9, 8, 7, 6, 5, 4],
            [6, 5, 4, 3, 2, 1, 9, 8, 7],
            [1, 9, 8, 7, 6, 5, 4, 3, 2],
            [4, 3, 2, 1, 9, 8, 7, 6, 5],
            [7, 6, 5, 4, 3, 2, 1, 9, 8],
            [2, 1, 9, 8, 7, 6, 5, 4, 3],
            [5, 4, 3, 2, 1, 9, 8, 7, 6],
            [8, 7, 6, 5, 4, 3, 2, 1, 9],
        ];

        let sudokuGen = new SudokuGenerator();
        sudokuGen.verticalSymmetry(initialArray);
        expect(initialArray).to.deep.equal(expectedArray);
        done();
    });

    it('Inversion symétrique par rapport à la rangée du milieu', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let expectedArray = [
            [9, 1, 2, 3, 4, 5, 6, 7, 8],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [1, 2, 3, 4, 5, 6, 7, 8, 9]];

        let sudokuGen = new SudokuGenerator();
        sudokuGen.horizontalSymmetry(initialArray);
        expect(initialArray).to.deep.equal(expectedArray);
        done();
    });

    it('Inversion symétrique par rapport à la diagonale', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let expectedArray = [
            [1, 4, 7, 2, 5, 8, 3, 6, 9],
            [2, 5, 8, 3, 6, 9, 4, 7, 1],
            [3, 6, 9, 4, 7, 1, 5, 8, 2],
            [4, 7, 1, 5, 8, 2, 6, 9, 3],
            [5, 8, 2, 6, 9, 3, 7, 1, 4],
            [6, 9, 3, 7, 1, 4, 8, 2, 5],
            [7, 1, 4, 8, 2, 5, 9, 3, 6],
            [8, 2, 5, 9, 3, 6, 1, 4, 7],
            [9, 3, 6, 1, 4, 7, 2, 5, 8]];

        let sudokuGen = new SudokuGenerator();
        sudokuGen.diagonalSymmetry(initialArray);
        expect(initialArray).to.deep.equal(expectedArray);
        done();
    });

    it('Changement de 2 colonnes', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let sudokuGen = new SudokuGenerator();
        let copy: number[][] = sudokuGen.deepCopy(initialArray);
        let col1: number;
        let col2: number;
        let sameSquare: boolean;

        sudokuGen.changeColumns(initialArray);

        for (let col = 0; col < initialArray.length; col++) {
            if (copy[0][col] !== initialArray[0][col]) {
                if (col1 === undefined) {
                    col1 = col;
                }
                else {
                    col2 = col;
                    break;
                }
            }
        }

        if (col1 < 3) {
            sameSquare = col2 < 3;
        }
        else if (col1 > 2 && col1 < 6) {
            sameSquare = col2 > 2 && col2 < 6;
        }
        else if (col1 > 5 && col1 < 9) {
            sameSquare = col2 > 5 && col2 < 9;
        }

        expect(sameSquare && col1 !== col2).to.deep.equal(true);
        done();
    });

    it('Changement de 2 rangees', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let sudokuGen = new SudokuGenerator();
        let copy: number[][] = sudokuGen.deepCopy(initialArray);
        let ran1: number;
        let ran2: number;
        let sameSquare: boolean;

        sudokuGen.changeRows(initialArray);

        for (let ran = 0; ran < initialArray.length; ran++) {
            if (initialArray[ran][0] !== copy[ran][0]) {
                if (ran1 === undefined) {
                    ran1 = ran;
                }
                else {
                    ran2 = ran;
                }
            }
        }

        if (ran1 < 3) {
            sameSquare = ran2 < 3;
        }
        else if (ran1 > 2 && ran1 < 6) {
            sameSquare = ran2 > 2 && ran2 < 6;
        }
        else if (ran1 > 5 && ran1 < 9) {
            sameSquare = ran2 > 5 && ran2 < 9;
        }

        expect(sameSquare && ran1 !== ran2).to.deep.equal(true);
        done();
    });

    it('Effacement de numero: facile', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let inExpectedRange: boolean;
        let n = 0;
        let sudokuGen = new SudokuGenerator();

        sudokuGen.eraseNumbers('facile', initialArray);

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (initialArray[i][j] === 0) {
                    n++;
                }
            }
        }

        inExpectedRange = n >= 20 && n <= 30;
        expect(inExpectedRange).to.deep.equal(true);
        done();
    });

    it('Effacement de numero: difficile', done => {

        let initialArray = [
            [1, 2, 3, 4, 5, 6, 7, 8, 9],
            [4, 5, 6, 7, 8, 9, 1, 2, 3],
            [7, 8, 9, 1, 2, 3, 4, 5, 6],
            [2, 3, 4, 5, 6, 7, 8, 9, 1],
            [5, 6, 7, 8, 9, 1, 2, 3, 4],
            [8, 9, 1, 2, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7, 8, 9, 1, 2],
            [6, 7, 8, 9, 1, 2, 3, 4, 5],
            [9, 1, 2, 3, 4, 5, 6, 7, 8]];

        let inExpectedRange: boolean;
        let n = 0;
        let sudokuGen = new SudokuGenerator();

        sudokuGen.eraseNumbers('difficile', initialArray);

        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (initialArray[i][j] === 0) {
                    n++;
                }
            }
        }

        inExpectedRange = n >= 40 && n <= 50;
        expect(inExpectedRange).to.deep.equal(true);
        done();
    });

});
