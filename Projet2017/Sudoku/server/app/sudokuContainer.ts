import { SudokuGenerator } from './sudokuGenerator/sudokuGenerator';
import { Communicator } from './communicator';



export class SudokuContainer {

    sudokuGenerator: SudokuGenerator;
    easy: any[] = [];
    hard: any[] = [];
    LIMIT_SUDOKU = 3;

    constructor() {
        this.sudokuGenerator = new SudokuGenerator();
    }

    addSudoku(difficulty: string) {

        let io = Communicator.getIo();

        if (io) {
            //let the client know if a sudoku is added to the container
            io.emit('sudoku_added', difficulty);
        }

        let sudoku = this.sudokuGenerator.createSudoku(difficulty);

        if (difficulty === 'facile' && this.easy.length < 3) {
            this.easy.unshift(sudoku);
        }
        else {
            if (this.hard.length < 3) {
                this.hard.unshift(sudoku);
            }
        }
        console.log("Container contains", this.easy.length, "easy sudokus and", this.hard.length, "hard sudokus");

    }

    public init() {
        for (let i = 0; i < this.LIMIT_SUDOKU; i++) {
            this.addSudoku('facile');
        }
        for (let i = 0; i < this.LIMIT_SUDOKU; i++) {
            this.addSudoku('difficile');
        }
    }

    public pop(diff: string): any {
        if (diff === 'facile') {
            if (this.easy.length === 0) {
                return null;
            }
            return this.easy.pop();
        }
        else {
            if (this.hard.length === 0) {
                return null;
            }
            return this.hard.pop();
        }
    }

}

