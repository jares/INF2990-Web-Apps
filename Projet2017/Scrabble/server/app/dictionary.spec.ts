import { expect } from 'chai';
import { Dictionary } from './dictionary.service';

describe('Dictionary tests', () => {
    it('Verification de la taille du dictionnaire', done => {
        let expectedSize = 321816;
        expect(Dictionary.dictionary.length).to.equal(expectedSize);
        done();
    });
    it('Verification d\'un mot valide', done => {
        let expectedAnswer = true;
        let answer = Dictionary.isValid("DUNES");
        expect(answer).to.equal(expectedAnswer);
        done();
    });
     it('Verification d\'un mot non valide', done => {
        let expectedAnswer = false;
        let answer = Dictionary.isValid("AFKJC");
        expect(answer).to.equal(expectedAnswer);
        done();
    });
    it('Verification de l\'index d\'un mot dans le dictionnaire', done => {
        let expectedIndex = 301937;
        let index = Dictionary.dictionary.indexOf('TES');
        expect(index).to.equal(expectedIndex);
        done();
    });
});
