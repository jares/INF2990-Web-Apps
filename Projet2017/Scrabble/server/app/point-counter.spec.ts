import { expect } from 'chai';
import { PointCounter } from './point-counter.service';
import { Tile } from './tile';

describe('PointCounter tests', () => {
    let counter = new PointCounter();

    it('Verification de la génération du nom de la case', done => {
        let cell1 = counter.getCellFromCoordinates(7, 7);  // H8
        let cell2 = counter.getCellFromCoordinates(14, 0); // O1
        let cell3 = counter.getCellFromCoordinates(4, 10);  // E11
        let goodNames = cell1 === "H8" && cell2 === "O1" && cell3 === "E11";
        expect(goodNames).to.equal(true);
        done();
    });
    it('Verification des bonus selon coordonnées', done => {
        let bonus1 = counter.getMultiplierFromCoordinates(4, 4);  // w2
        let bonus2 = counter.getMultiplierFromCoordinates(0, 14); // w3
        let bonus3 = counter.getMultiplierFromCoordinates(5, 9);  // l3
        let bonus4 = counter.getMultiplierFromCoordinates(12, 6);  // l2
        let bonus = bonus1.w === 2 && bonus2.w === 3 && bonus3.l === 3 && bonus4.l === 2;
        expect(bonus).to.equal(true);
        done();
    });
    it("Verification de la génération de la valeur d'une lettre", done => {
        let val1 = counter.findValue('E');  // 1
        let val2 = counter.findValue('Z');  // 10
        let val3 = counter.findValue('H');  // 4
        let goodValues = val1 === 1 && val2 === 10 && val3 === 4;
        expect(goodValues).to.equal(true);
        done();
    });
    it('Verification du calcul du score (horizontal)', done => {
        let expectedAnswer = 14;
        let newWord: Tile[] = [];
        newWord.push(new Tile('D', false));
        newWord.push(new Tile('U', false));
        newWord.push(new Tile('N', false));
        newWord.push(new Tile('E', false));
        newWord.push(new Tile('S', false));
        let answer = counter.getScore({ i: 2, j: 2, orientation: 'H' }, newWord);
        expect(answer).to.equal(expectedAnswer);
        done();
    });

    it('Verification du calcul du score (vertical)', done => {
        let expectedAnswer = 78;
        let newWord: Tile[] = [];
        newWord.push(new Tile('Z', false));
        newWord.push(new Tile('E', false));
        newWord.push(new Tile('B', false));
        newWord.push(new Tile('R', false));
        newWord.push(new Tile('E', false));
        let answer = counter.getScore({ i: 3, j: 14, orientation: 'V' }, newWord);
        expect(answer).to.equal(expectedAnswer);
        done();
    });
});
