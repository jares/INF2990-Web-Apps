import { expect } from 'chai';
import { Board } from './board';
import { Tile } from './tile';

describe('Board tests', () => {
    let board = new Board();
    let tileA = new Tile('A', false);
    let tileD = new Tile('D', false);
    let tileU = new Tile('U', false);
    let tileN = new Tile('N', false);
    let tileE = new Tile('E', false);
    let tileS = new Tile('S', false);

    it('Verification de l\'ajout d\'une tuile sur la planche', done => {
        board.addTile(3, 3, tileA);
        board.addTile(0, 0, tileA);
        board.addTile(0, 7, tileA);
        board.addTile(0, 14, tileA);
        board.addTile(14, 0, tileA);
        board.addTile(7, 7, tileA);
        board.addTile(12, 3, tileA);
        board.addTile(6, 9, tileA);
        expect(board.getCell(3, 3)).to.equal('A');
        expect(board.getCell(0, 0)).to.equal('A');
        expect(board.getCell(0, 7)).to.equal('A');
        expect(board.getCell(0, 14)).to.equal('A');
        expect(board.getCell(14, 0)).to.equal('A');
        expect(board.getCell(7, 7)).to.equal('A');
        expect(board.getCell(12, 3)).to.equal('A');
        expect(board.getCell(6, 9)).to.equal('A');
        done();
    });
    it('Verification du retrait d\'une tuile de la planche', done => {
        board.removeLetter(3, 3);
        board.removeLetter(0, 0);
        board.removeLetter(0, 7);
        board.removeLetter(0, 14);
        board.removeLetter(14, 0);
        board.removeLetter(7, 7);
        board.removeLetter(12, 3);
        board.removeLetter(6, 9);
        expect(board.getCell(3, 3)).to.equal(null);
        expect(board.getCell(0, 0)).to.equal(null);
        expect(board.getCell(0, 7)).to.equal(null);
        expect(board.getCell(0, 14)).to.equal(null);
        expect(board.getCell(14, 0)).to.equal(null);
        expect(board.getCell(7, 7)).to.equal(null);
        expect(board.getCell(12, 3)).to.equal(null);
        expect(board.getCell(6, 9)).to.equal(null);
        done();
    });
    //  it('Verification de l\'ajout d\'une tuile de la planche', done => {
    //      for (let i = 0; i <= 14; i++) {
    //         for (let j = 0; j <= 14; i++) {
    //             board.addTile(i, j, tileA);
    //         }
    //     }
    //     for (let i = 0; i <= 14; i++) {
    //         for (let j = 0; j <= 14; i++) {
    //             expect(board.getCell(i, j)).to.equal('A');
    //         }
    //     }
    //     done();
    // });
    // it('Verification du retrait d\'une tuile de la planche', done => {
    //      for (let i = 0; i <= 14; i++) {
    //         for (let j = 0; j <= 14; i++) {
    //             board.removeLetter(i, j);
    //         }
    //     }
    //     for (let i = 0; i <= 14; i++) {
    //         for (let j = 0; j <= 14; i++) {
    //             expect(board.getCell(i, j)).to.equal(null);
    //         }
    //     }
    //     done();
    // });
    it('Verification de la positon centrale au premier tour', done => {
        let coordinates1 = { i: 0, j: 3, orientation: 'H' };
        let coordinates2 = { i: 7, j: 4, orientation: 'H' };
        let coordinates3 = { i: 7, j: 7, orientation: 'H' };
        let coordinates4 = { i: 5, j: 7, orientation: 'V' };
        let coordinates5 = { i: 11, j: 8, orientation: 'H' };
        expect(board.checkIfOnCenter(coordinates1, 3)).to.equal(false);
        expect(board.checkIfOnCenter(coordinates2, 4)).to.equal(true);
        expect(board.checkIfOnCenter(coordinates3, 3)).to.equal(true);
        expect(board.checkIfOnCenter(coordinates4, 3)).to.equal(true);
        expect(board.checkIfOnCenter(coordinates5, 3)).to.equal(false);
        done();
    });
    it('Verification de la presence de lettres adjacentes', done => {
        board.addTile(3, 3, tileA);
        board.addTile(7, 7, tileA);
        let coordinates1 = { i: 0, j: 3, orientation: 'V' };
        let coordinates2 = { i: 7, j: 4, orientation: 'H' };
        expect(board.isTouchingLetters(coordinates1, 1)).to.equal(false);
        expect(board.isTouchingLetters(coordinates1, 3)).to.equal(true);
        expect(board.isTouchingLetters(coordinates2, 1)).to.equal(false);
        expect(board.isTouchingLetters(coordinates2, 3)).to.equal(true);
        done();
    });
    it('Verification d\'un mot dans la colonne', done => {
        board.addTile(3, 3, tileD);
        board.addTile(4, 3, tileU);
        board.addTile(5, 3, tileN);
        board.addTile(6, 3, tileE);
        board.addTile(7, 3, tileS);
        let test1 = board.getWordFromColumn(3, 3).word;
        let test2 = board.getWordFromColumn(6, 3).word;
        let test3 = board.getWordFromColumn(11, 4).word;
        expect(test1).to.equal("DUNES");
        expect(test2).to.equal("DUNES");
        expect(test3).to.equal("");
        done();
    });
    it('Verification d\'un mot dans la rangee', done => {
        board.addTile(3, 3, tileD);
        board.addTile(3, 4, tileU);
        board.addTile(3, 5, tileN);
        board.addTile(3, 6, tileE);
        board.addTile(3, 7, tileS);
        let test1 = board.getWordFromRow(3, 3).word;
        let test2 = board.getWordFromRow(3, 6).word;
        let test3 = board.getWordFromRow(11, 4).word;
        expect(test1).to.equal("DUNES");
        expect(test2).to.equal("DUNES");
        expect(test3).to.equal("");
        done();
    });
    it('Verification de l\'espace disponible sur le board', done => {
        let coordinates1 = { i: 3, j: 3, orientation: 'H' };
        let coordinates2 = { i: 7, j: 4, orientation: 'V' };
        let coordinates3 = { i: 7, j: 12, orientation: 'H' };
        let coordinates4 = { i: 14, j: 7, orientation: 'V' };
        expect(board.hasRoom(coordinates1, "DUNES")).to.equal(true);
        expect(board.hasRoom(coordinates2, "DUNES")).to.equal(true);
        expect(board.hasRoom(coordinates3, "DUNES")).to.equal(false);
        expect(board.hasRoom(coordinates4, "DUNES")).to.equal(false);
        done();
    });
});
