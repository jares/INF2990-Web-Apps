import { Score } from '../classes/score';
import { expect } from 'chai';
import { Stone } from '../classes/stone';

describe('Calculate score tests', () => {

    it('1. There is no winner (no stone on ice)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();
        let isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(null);
        done();
    });

    it('2. There is no winner (stones on ice)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "red", 0);
        object1.mesh.position.set(65.49, 0, 1100);

        let object2 = new Stone(new THREE.Object3D(), "yellow", 0);
        object2.mesh.position.set(54.47, 0, 1100);

        let object3 = new Stone(new THREE.Object3D(), "red", 0);
        object3.mesh.position.set(43.45, 0, 1100);

        let object4 = new Stone(new THREE.Object3D(), "yellow", 0);
        object4.mesh.position.set(32.43, 0, 1100);

        let object5 = new Stone(new THREE.Object3D(), "red", 0);
        object5.mesh.position.set(21.41, 0, 1100);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);

        let isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(null);
        done();
    });

    it('3. winner should be red (all stone in house)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "yellow", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "yellow", 0);
        object2.mesh.position.set(54.47, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "red", 0);
        object3.mesh.position.set(43.45, 0, 1220);

        let object4 = new Stone(new THREE.Object3D(), "yellow", 0);
        object4.mesh.position.set(32.43, 0, 1220);

        let object5 = new Stone(new THREE.Object3D(), "red", 0);
        object5.mesh.position.set(21.41, 0, 1220);

        let object6 = new Stone(new THREE.Object3D(), "red", 0);
        object6.mesh.position.set(10.39, 0, 1220);

        let object7 = new Stone(new THREE.Object3D(), "yellow", 0);
        object7.mesh.position.set(-0.63, 0, 1180);

        let object10 = new Stone(new THREE.Object3D(), "yellow", 0);
        object10.mesh.position.set(-33.69, 0, 1220);

        let object11 = new Stone(new THREE.Object3D(), "red", 0);
        object11.mesh.position.set(-44.71, 0, 1220);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);
        stonesOnIce.push(object10);
        stonesOnIce.push(object11);

        let isYellowWinner = true;
        isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(false);
        done();
    });

    it('4. winner should be yellow (all stone in house)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "red", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "red", 0);
        object2.mesh.position.set(54.47, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "yellow", 0);
        object3.mesh.position.set(43.45, 0, 1220);

        let object4 = new Stone(new THREE.Object3D(), "red", 0);
        object4.mesh.position.set(32.43, 0, 1220);

        let object5 = new Stone(new THREE.Object3D(), "yellow", 0);
        object5.mesh.position.set(21.41, 0, 1220);

        let object6 = new Stone(new THREE.Object3D(), "yellow", 0);
        object6.mesh.position.set(10.39, 0, 1220);

        let object7 = new Stone(new THREE.Object3D(), "red", 0);
        object7.mesh.position.set(-0.63, 0, 1180);

        let object10 = new Stone(new THREE.Object3D(), "red", 0);
        object10.mesh.position.set(-33.69, 0, 1220);

        let object11 = new Stone(new THREE.Object3D(), "yellow", 0);
        object11.mesh.position.set(-44.71, 0, 1220);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);
        stonesOnIce.push(object10);
        stonesOnIce.push(object11);

        let isYellowWinner = true;
        isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(true);
        done();
    });

    it('5. red winner (stone everywhere)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "yellow", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "red", 0);
        object2.mesh.position.set(0, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "red", 0);
        object3.mesh.position.set(0, 0, 1100);

        let object4 = new Stone(new THREE.Object3D(), "yellow", 0);
        object4.mesh.position.set(-55, 0, 1250);

        let object5 = new Stone(new THREE.Object3D(), "yellow", 0);
        object5.mesh.position.set(45, 0, 1050);

        let object6 = new Stone(new THREE.Object3D(), "red", 0);
        object6.mesh.position.set(30, 0, 1080);

        let object7 = new Stone(new THREE.Object3D(), "yellow", 0);
        object7.mesh.position.set(-25, 0, 1210);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);

        let isYellowWinner = true;
        isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(false);
        done();
    });

    it('6. yellow winner (stone everywhere)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "red", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "yellow", 0);
        object2.mesh.position.set(0, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "yellow", 0);
        object3.mesh.position.set(0, 0, 1100);

        let object4 = new Stone(new THREE.Object3D(), "red", 0);
        object4.mesh.position.set(-55, 0, 1250);

        let object5 = new Stone(new THREE.Object3D(), "red", 0);
        object5.mesh.position.set(45, 0, 1050);

        let object6 = new Stone(new THREE.Object3D(), "yellow", 0);
        object6.mesh.position.set(30, 0, 1080);

        let object7 = new Stone(new THREE.Object3D(), "red", 0);
        object7.mesh.position.set(-25, 0, 1210);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);

        let isYellowWinner = true;
        isYellowWinner = pointCalculator.updateGame(stonesOnIce);
        expect(isYellowWinner).to.deep.equal(true);
        done();
    });

    it('7. red winner have 1 point (stone everywhere)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "yellow", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "red", 0);
        object2.mesh.position.set(0, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "red", 0);
        object3.mesh.position.set(0, 0, 1100);

        let object4 = new Stone(new THREE.Object3D(), "yellow", 0);
        object4.mesh.position.set(-55, 0, 1250);

        let object5 = new Stone(new THREE.Object3D(), "yellow", 0);
        object5.mesh.position.set(45, 0, 1050);

        let object6 = new Stone(new THREE.Object3D(), "red", 0);
        object6.mesh.position.set(30, 0, 1080);

        let object7 = new Stone(new THREE.Object3D(), "yellow", 0);
        object7.mesh.position.set(-25, 0, 1210);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);

        let scoringStones = [];
        scoringStones = pointCalculator.getScoringStones(stonesOnIce);
        expect(scoringStones[0].color).to.deep.equal("red");
        expect(scoringStones.length).to.deep.equal(1);
        done();
    });

    it('8. yellow winner have 1 point (stone everywhere)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "red", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "yellow", 0);
        object2.mesh.position.set(0, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "yellow", 0);
        object3.mesh.position.set(0, 0, 1100);

        let object4 = new Stone(new THREE.Object3D(), "red", 0);
        object4.mesh.position.set(-55, 0, 1250);

        let object5 = new Stone(new THREE.Object3D(), "red", 0);
        object5.mesh.position.set(45, 0, 1050);

        let object6 = new Stone(new THREE.Object3D(), "yellow", 0);
        object6.mesh.position.set(30, 0, 1080);

        let object7 = new Stone(new THREE.Object3D(), "red", 0);
        object7.mesh.position.set(-25, 0, 1210);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);

        let scoringStones = [];
        scoringStones = pointCalculator.getScoringStones(stonesOnIce);
        expect(scoringStones[0].color).to.deep.equal("yellow");
        expect(scoringStones.length).to.deep.equal(1);
        done();
    });

    it('9. red winner have 2 point (stone in house)', done => {
        let stonesOnIce: any = [];
        let pointCalculator = new Score();

        let object1 = new Stone(new THREE.Object3D(), "yellow", 0);
        object1.mesh.position.set(0, 0, 75);

        let object2 = new Stone(new THREE.Object3D(), "yellow", 0);
        object2.mesh.position.set(54.47, 0, 1220);

        let object3 = new Stone(new THREE.Object3D(), "red", 0);
        object3.mesh.position.set(43.45, 0, 1220);

        let object4 = new Stone(new THREE.Object3D(), "yellow", 0);
        object4.mesh.position.set(32.43, 0, 1220);

        let object5 = new Stone(new THREE.Object3D(), "red", 0);
        object5.mesh.position.set(21.41, 0, 1220);

        let object6 = new Stone(new THREE.Object3D(), "red", 0);
        object6.mesh.position.set(10.39, 0, 1220);

        let object7 = new Stone(new THREE.Object3D(), "yellow", 0);
        object7.mesh.position.set(-0.63, 0, 1180);

        let object10 = new Stone(new THREE.Object3D(), "yellow", 0);
        object10.mesh.position.set(-33.69, 0, 1220);

        let object11 = new Stone(new THREE.Object3D(), "red", 0);
        object11.mesh.position.set(-44.71, 0, 1220);

        stonesOnIce.push(object1);
        stonesOnIce.push(object2);
        stonesOnIce.push(object3);
        stonesOnIce.push(object4);
        stonesOnIce.push(object5);
        stonesOnIce.push(object6);
        stonesOnIce.push(object7);
        stonesOnIce.push(object10);
        stonesOnIce.push(object11);

        let scoringStones = [];
        scoringStones = pointCalculator.getScoringStones(stonesOnIce);
        expect(scoringStones[0].color).to.deep.equal("red");
        expect(scoringStones.length).to.deep.equal(2);
        done();
    });

});
