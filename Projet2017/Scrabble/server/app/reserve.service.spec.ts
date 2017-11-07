import { expect } from 'chai';
import { Reserve } from './reserve.service';

describe('Reserve tests', () => {
    it('Verification de la taille de la reserve', done => {
        let expectedSize = 102;
        let reserve = new Reserve();
        reserve.createReserve();
        expect(reserve.bag.length).to.equal(expectedSize);
        done();
    });
    it('Verification du nombre de \'A\' de la reserve', done => {
        let expectedNumber = 9;
        let reserve = new Reserve();
        reserve.createReserve();
        let numberOfTiles = 0;
        for (let i = 0; i < reserve.bag.length; i++){
            if (reserve.bag[i] === "A"){
                numberOfTiles++;
            }
        }
        expect(numberOfTiles).to.equal(expectedNumber);
        done();
    });
     it('Verification de la taille d\'un chevalet genere au hasard', done => {
        let expectedSize = 7;
        let reserve = new Reserve();
        reserve.createReserve();
        let rack = reserve.getLetters(7);
        console.log("Rack of size", rack.length);
        expect(rack.length).to.equal(expectedSize);
        done();
    });
    it('Verification de l\'ajout d\'une tuile dans la reserve', done => {
        let expectedSize = 103;
        let reserve = new Reserve();
        reserve.createReserve();
        reserve.addLetters("A");
        expect(reserve.bag.length).to.equal(expectedSize);
        done();
    });
});
