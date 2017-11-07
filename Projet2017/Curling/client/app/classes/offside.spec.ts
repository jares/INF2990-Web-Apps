import { Offside } from '../classes/offside';
import { expect } from 'chai';

const RADIUS = 4.500247917274692;

describe('Offside tests', () => {

    let offside = new Offside();

    it('Stone is in bound (hog)', done => {

        let zpos = 1100;
        let isOffSide = offside.verifyHogLine(zpos, RADIUS);
        expect(isOffSide).to.deep.equal(false);
        done();
    });

    it('Stone is not in bound (hog)', done => {

        let zpos = 900;
        let isOffSide = offside.verifyHogLine(zpos, RADIUS);
        expect(isOffSide).to.deep.equal(true);
        done();
    });

    it('Stone is in bound (side)', done => {

        let xpos = 0;
        let isOffSide = offside.verifySide(xpos, RADIUS);
        expect(isOffSide).to.deep.equal(false);
        done();
    });

    it('Stone is not in bound (side)', done => {

        let xpos = 76;
        let isOffSide = offside.verifySide(xpos, RADIUS);
        expect(isOffSide).to.deep.equal(true);
        done();
    });

    it('Stone is in bound (backline)', done => {

        let xpos = 0;
        let isOffSide = offside.verifySide(xpos, RADIUS);
        expect(isOffSide).to.deep.equal(false);
        done();
    });

    it('Stone is in bound (backline)', done => {

        let zpos = 800;
        let isOffSide = offside.verifyBackLine(zpos, RADIUS);
        expect(isOffSide).to.deep.equal(false);
        done();
    });

    it('Stone is not  in bound (backline)', done => {

        let zpos = 1300;
        let isOffSide = offside.verifyBackLine(zpos, RADIUS);
        expect(isOffSide).to.deep.equal(true);
        done();
    });
});
