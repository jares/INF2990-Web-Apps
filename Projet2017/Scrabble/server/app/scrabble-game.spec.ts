import { expect } from 'chai';
import { ScrabbleGame } from './scrabble-game';
import { Tile } from './tile';
import { Board } from './board';

describe('Game tests', () => {
    let game = new ScrabbleGame(2);
    // game.isFirstTurn = false;
    it('Verification du traitement des coordonees', done => {
        let expectedAnswer = { i: 7, j: 9, orientation: 'V' };
        let coordinates = game.parseCoordinates('h10v');
        expect(coordinates.i).to.equal(expectedAnswer.i);
        expect(coordinates.j).to.equal(expectedAnswer.j);
        expect(coordinates.orientation).to.equal(expectedAnswer.orientation);
        done();
    });
    it('Verification du traitement des caracteres accentues', done => {
        let expectedAnswer = "EACIOEIOEUUA";
        let answer = game.removeAccents("ÈÀÇÎÔÊÏÖÉÜÛÄ");
        expect(answer).to.equal(expectedAnswer);
        done();
    });
    it('Verification de l\'ajout d\'une lettre sur la planche', done => {
        let coordinates = game.parseCoordinates('h10v');
        let tileD = new Tile('D', false);
        game.addLetterOnBoard(coordinates.i, coordinates.j, tileD);
        expect(game.board.getCell(7, 9)).to.equal('D');
        done();
    });
    it('Verification de l\'ajout d\'un mot sur la planche', done => {
        let coordinates = game.parseCoordinates('l4h');
        let tiles: Tile[] = [];
        tiles.push(new Tile('D', false));
        tiles.push(new Tile('U', false));
        tiles.push(new Tile('N', false));
        tiles.push(new Tile('E', false));
        tiles.push(new Tile('S', false));
        game.addLettersOnBoard(coordinates, tiles);
        let expectedString: string = game.board.getCell(11, 3) + game.board.getCell(11, 4) + game.board.getCell(11, 5)
            + game.board.getCell(11, 6) + game.board.getCell(11, 7);
        expect(expectedString).to.equal('DUNES');
        done();
    });
    it('Verification du retrait d\'un mot de la planche', done => {
        let coordinates = game.parseCoordinates('l4h');
        let expectedBoard = new Board();
        let tiles: Tile[] = [];
        tiles.push(new Tile('D', false));
        tiles.push(new Tile('U', false));
        tiles.push(new Tile('N', false));
        tiles.push(new Tile('E', false));
        tiles.push(new Tile('S', false));
        game.addLettersOnBoard(coordinates, tiles);
        game.removeLetterFromBoard(11, 3);
        game.removeLetterFromBoard(11, 4);
        game.removeLetterFromBoard(11, 5);
        game.removeLetterFromBoard(11, 6);
        game.removeLetterFromBoard(11, 7);
        expect(game.board.getCell(11, 3)).to.equal(expectedBoard.getCell(11, 3));
        expect(game.board.getCell(11, 3)).to.equal(expectedBoard.getCell(11, 4));
        expect(game.board.getCell(11, 3)).to.equal(expectedBoard.getCell(11, 5));
        expect(game.board.getCell(11, 3)).to.equal(expectedBoard.getCell(11, 6));
        expect(game.board.getCell(11, 3)).to.equal(expectedBoard.getCell(11, 7));
        done();
    });
});
