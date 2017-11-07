import { Bot } from './bot';
import { Stone } from './stone';
import { expect } from 'chai';

describe('Bot tests', () => {

    it('There is no stone on the ice', done => {
        let bot = new Bot(false);
        let decidedVector = bot.getDirectionVector([], [], []);
        expect(decidedVector).to.deep.equal(new THREE.Vector3(0, 0, 1));
        done();
    });

    it('Stone can go straight ahead', done => {
        let bot = new Bot(false);
        let stone = new Stone(new THREE.Object3D(), "red", 0);
        stone.mesh.position.set(0, 0, 1230);

        let onIce: Stone[] = [];
        onIce.push(stone);

        let isStraightThrow = bot.checkStraightThrow(onIce);
        expect(isStraightThrow).to.deep.equal(true);
        done();
    });

    it('Stone cause collision straight ahead', done => {
        let bot = new Bot(false);
        let stone = new Stone(new THREE.Object3D(), "red", 0);
        stone.mesh.position.set(0, 0, 1100);

        let onIce = [];
        onIce.push(stone);

        let isStraightThrow = bot.checkStraightThrow(onIce);
        expect(isStraightThrow).to.deep.equal(false);
        done();
    });

    it('Stone is in the way of the throw', done => {
        let bot = new Bot(false);
        bot.finalPosition = new THREE.Vector3(60, 0, 1380 - 160);
        let stone = new Stone(new THREE.Object3D(), "red", 0);
        stone.mesh.position.set(54.1, 0, 1100);

        let onIce = [];
        onIce.push(stone);

        let isClearRoute = bot.checkClearRoute(onIce, false);
        expect(isClearRoute).to.deep.equal(false);
        done();
    });

    it('Stone is not in the way of the throw', done => {
        let bot = new Bot(false);
        bot.finalPosition = new THREE.Vector3(60, 0, 1380 - 160);
        let stone = new Stone(new THREE.Object3D(), "red", 0);
        stone.mesh.position.set(0, 0, 1100);

        let onIce = [];
        onIce.push(stone);

        let isClearRoute = bot.checkClearRoute(onIce, false);
        expect(isClearRoute).to.deep.equal(true);
        done();
    });

    it('Stone will be thrown off centered on the left', done => {
        let bot = new Bot(false);
        let stone1 = new Stone(new THREE.Object3D(), "red", 1);
        stone1.mesh.position.set(0, 0, 1100);
        let stone2 = new Stone(new THREE.Object3D(), "red", 2);
        stone2.mesh.position.set(-20, 0, 1100);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);

        let decidedVector = bot.getDirectionVector([], onIce, []);
        let final = new THREE.Vector3(18.04, 0, 1380 - 160);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Stone will be thrown to knock a yellow stone', done => {
        let bot = new Bot(false);
        let stone1 = new Stone(new THREE.Object3D(), "red", 1);
        stone1.mesh.position.set(65.49, 0, 1100);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", 2);
        stone2.mesh.position.set(54.47, 0, 1100);
        let stone3 = new Stone(new THREE.Object3D(), "red", 3);
        stone3.mesh.position.set(43.45, 0, 1100);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", 4);
        stone4.mesh.position.set(32.43, 0, 1100);
        let stone5 = new Stone(new THREE.Object3D(), "red", 5);
        stone5.mesh.position.set(21.41, 0, 1100);
        let stone6 = new Stone(new THREE.Object3D(), "yellow", 6);
        stone6.mesh.position.set(10.39, 0, 1100);
        let stone7 = new Stone(new THREE.Object3D(), "red", 7);
        stone7.mesh.position.set(-0.63, 0, 1100);
        let stone8 = new Stone(new THREE.Object3D(), "yellow", 8);
        stone8.mesh.position.set(-11.65, 0, 1100);
        let stone9 = new Stone(new THREE.Object3D(), "red", 9);
        stone9.mesh.position.set(-22.67, 0, 1100);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", 10);
        stone10.mesh.position.set(-33.69, 0, 1140);
        let stone11 = new Stone(new THREE.Object3D(), "red", 11);
        stone11.mesh.position.set(-44.71, 0, 1100);
        let stone12 = new Stone(new THREE.Object3D(), "yellow", 12);
        stone12.mesh.position.set(-55.73, 0, 1100);

        let onIce: Stone[] = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone8);
        onIce.push(stone9);
        onIce.push(stone10);
        onIce.push(stone11);
        onIce.push(stone12);

        let decidedVector = bot.getDirectionVector([], onIce, []);
        let final = new THREE.Vector3(-33.69, 0, 1140);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Stone will be thrown to knock a yellow stone even with a red stone closer to house', done => {
        let bot = new Bot(false);
        let stone1 = new Stone(new THREE.Object3D(), "red", 1);
        stone1.mesh.position.set(65.49, 0, 1100);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", 2);
        stone2.mesh.position.set(54.47, 0, 1100);
        let stone3 = new Stone(new THREE.Object3D(), "red", 3);
        stone3.mesh.position.set(43.45, 0, 1100);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", 4);
        stone4.mesh.position.set(32.43, 0, 1100);
        let stone5 = new Stone(new THREE.Object3D(), "red", 5);
        stone5.mesh.position.set(21.41, 0, 1100);
        let stone6 = new Stone(new THREE.Object3D(), "yellow", 6);
        stone6.mesh.position.set(10.39, 0, 1100);
        let stone7 = new Stone(new THREE.Object3D(), "red", 7);
        stone7.mesh.position.set(-0.63, 0, 1150);
        let stone8 = new Stone(new THREE.Object3D(), "yellow", 8);
        stone8.mesh.position.set(-11.65, 0, 1100);
        let stone9 = new Stone(new THREE.Object3D(), "red", 9);
        stone9.mesh.position.set(-22.67, 0, 1100);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", 10);
        stone10.mesh.position.set(-33.69, 0, 1140);
        let stone11 = new Stone(new THREE.Object3D(), "red", 11);
        stone11.mesh.position.set(-44.71, 0, 1100);
        let stone12 = new Stone(new THREE.Object3D(), "yellow", 12);
        stone12.mesh.position.set(-55.73, 0, 1100);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone8);
        onIce.push(stone9);
        onIce.push(stone10);
        onIce.push(stone11);
        onIce.push(stone12);

        let decidedVector = bot.getDirectionVector([], onIce, []);
        let final = new THREE.Vector3(-33.69, 0, 1140);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Stone will be thrown to knock the yellow stone closest to the house', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone1.mesh.position.set(65.49, 0, 1100);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone2.mesh.position.set(54.47, 0, 1100);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(43.45, 0, 1100);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(32.43, 0, 1100);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(21.41, 0, 1100);
        let stone6 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone6.mesh.position.set(10.39, 0, 1100);
        let stone7 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone7.mesh.position.set(-0.63, 0, 1150);
        let stone8 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone8.mesh.position.set(-11.65, 0, 1100);
        let stone9 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone9.mesh.position.set(-22.67, 0, 1100);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone10.mesh.position.set(-33.69, 0, 1140);
        let stone11 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone11.mesh.position.set(-44.71, 0, 1100);
        let stone12 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone12.mesh.position.set(-55.73, 0, 1100);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone8);
        onIce.push(stone9);
        onIce.push(stone10);
        onIce.push(stone11);
        onIce.push(stone12);

        let decidedVector = bot.getDirectionVector([], onIce, []);
        let final = new THREE.Vector3(-0.63, 0, 1150);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Stone will be thrown to knock the red stone closest to the house (same z)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone1.mesh.position.set(65.49, 0, 1100);
        let stone2 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone2.mesh.position.set(54.47, 0, 1100);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(43.45, 0, 1100);
        let stone4 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone4.mesh.position.set(32.43, 0, 1100);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(21.41, 0, 1100);
        let stone6 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone6.mesh.position.set(10.39, 0, 1100);
        let stone7 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone7.mesh.position.set(-0.63, 0, 1100);
        let stone8 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone8.mesh.position.set(-11.65, 0, 1100);
        let stone9 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone9.mesh.position.set(-22.67, 0, 1100);
        let stone10 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone10.mesh.position.set(-33.69, 0, 1100);
        let stone11 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone11.mesh.position.set(-44.71, 0, 1100);
        let stone12 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone12.mesh.position.set(-55.73, 0, 1100);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone8);
        onIce.push(stone9);
        onIce.push(stone10);
        onIce.push(stone11);
        onIce.push(stone12);

        let decidedVector = bot.getDirectionVector([], onIce, []);
        let final = new THREE.Vector3(-0.63, 0, 1100);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Bot put stone close to house (all stone in house yellow winner)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone1.mesh.position.set(0, 0, 75);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone2.mesh.position.set(54.47, 0, 1220);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(43.45, 0, 1220);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(32.43, 0, 1220);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(21.41, 0, 1220);
        let stone6 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone6.mesh.position.set(10.39, 0, 1220);
        let stone7 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone7.mesh.position.set(-0.63, 0, 1180);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone10.mesh.position.set(-33.69, 0, 1220);
        let stone11 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone11.mesh.position.set(-44.71, 0, 1220);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone10);
        onIce.push(stone11);

        let inHouse = [];
        inHouse.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });
        inHouse.push({ stoneOnIce: stone3, dist: fakeValue, color: stone3.color });
        inHouse.push({ stoneOnIce: stone4, dist: fakeValue, color: stone4.color });
        inHouse.push({ stoneOnIce: stone5, dist: fakeValue, color: stone5.color });
        inHouse.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });
        inHouse.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });
        inHouse.push({ stoneOnIce: stone10, dist: fakeValue, color: stone10.color });
        inHouse.push({ stoneOnIce: stone11, dist: fakeValue, color: stone11.color });

        let scoring = [];
        scoring.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });

        let decidedVector = bot.getDirectionVector(inHouse, onIce, scoring);
        let final = new THREE.Vector3(-18.04, 0, 1380 - 160);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Bot knock red stone closest to the house (all stone in house red winner)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone1.mesh.position.set(0, 0, 75);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone2.mesh.position.set(54.47, 0, 1220);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(43.45, 0, 1220);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(32.43, 0, 1220);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(21.41, 0, 1220);
        let stone6 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone6.mesh.position.set(10.39, 0, 1220);
        let stone7 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone7.mesh.position.set(-0.63, 0, 1180);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone10.mesh.position.set(-33.69, 0, 1220);
        let stone11 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone11.mesh.position.set(-44.71, 0, 1220);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone10);
        onIce.push(stone11);

        let inHouse = [];
        inHouse.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });
        inHouse.push({ stoneOnIce: stone3, dist: fakeValue, color: stone3.color });
        inHouse.push({ stoneOnIce: stone4, dist: fakeValue, color: stone4.color });
        inHouse.push({ stoneOnIce: stone5, dist: fakeValue, color: stone5.color });
        inHouse.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });
        inHouse.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });
        inHouse.push({ stoneOnIce: stone10, dist: fakeValue, color: stone10.color });
        inHouse.push({ stoneOnIce: stone11, dist: fakeValue, color: stone11.color });
        let scoring = [];
        scoring.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });
        scoring.push({ stoneOnIce: stone5, dist: fakeValue, color: stone5.color });

        let decidedVector = bot.getDirectionVector(inHouse, onIce, scoring);
        let final = new THREE.Vector3(10.39, 0, 1220);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Bot knocks red stone closest to house (all in house yellow winner)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone1.mesh.position.set(0, 0, 75);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone2.mesh.position.set(54.47, 0, 1220);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(43.45, 0, 1220);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(32.43, 0, 1220);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(21.41, 0, 1220);
        let stone6 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone6.mesh.position.set(10.39, 0, 1220);
        let stone7 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone7.mesh.position.set(-0.63, 0, 1210);
        let stone8 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone8.mesh.position.set(-11.65, 0, 1220);
        let stone9 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone9.mesh.position.set(-22.67, 0, 1220);
        let stone10 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone10.mesh.position.set(-33.69, 0, 1220);
        let stone11 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone11.mesh.position.set(-44.71, 0, 1220);
        let stone12 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone12.mesh.position.set(-55.73, 0, 1100);
        let stone13 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone1.mesh.position.set(65.49, 0, 1100);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);
        onIce.push(stone8);
        onIce.push(stone9);
        onIce.push(stone10);
        onIce.push(stone11);
        onIce.push(stone12);
        onIce.push(stone13);

        let inHouse = [];
        inHouse.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });
        inHouse.push({ stoneOnIce: stone3, dist: fakeValue, color: stone3.color });
        inHouse.push({ stoneOnIce: stone4, dist: fakeValue, color: stone4.color });
        inHouse.push({ stoneOnIce: stone5, dist: fakeValue, color: stone5.color });
        inHouse.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });
        inHouse.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });
        inHouse.push({ stoneOnIce: stone8, dist: fakeValue, color: stone8.color });
        inHouse.push({ stoneOnIce: stone9, dist: fakeValue, color: stone9.color });
        inHouse.push({ stoneOnIce: stone10, dist: fakeValue, color: stone10.color });
        inHouse.push({ stoneOnIce: stone11, dist: fakeValue, color: stone11.color });
        inHouse.push({ stoneOnIce: stone12, dist: fakeValue, color: stone12.color });
        inHouse.push({ stoneOnIce: stone13, dist: fakeValue, color: stone13.color });

        let scoring = [];
        scoring.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });

        let decidedVector = bot.getDirectionVector(inHouse, onIce, scoring);
        let final = new THREE.Vector3(10.39, 0, 1220);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Bot knocks yellow stone closest to house (all in house red winner)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone1.mesh.position.set(0, 0, 75);
        let stone2 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone2.mesh.position.set(-11.02, 0, 1210);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(-11.02, 0, 1220);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(11.02, 0, 1210);
        let stone5 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone5.mesh.position.set(11.02, 0, 1220);
        let stone6 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone6.mesh.position.set(0, 0, 1210);
        let stone7 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone7.mesh.position.set(0, 0, 1220);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);

        let inHouse = [];
        inHouse.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });
        inHouse.push({ stoneOnIce: stone3, dist: fakeValue, color: stone3.color });
        inHouse.push({ stoneOnIce: stone4, dist: fakeValue, color: stone4.color });
        inHouse.push({ stoneOnIce: stone5, dist: fakeValue, color: stone5.color });
        inHouse.push({ stoneOnIce: stone6, dist: fakeValue, color: stone6.color });
        inHouse.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });

        let scoring = [];
        scoring.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });

        let decidedVector = bot.getDirectionVector(inHouse, onIce, scoring);
        let final = new THREE.Vector3(0, 0, 1220);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });

    it('Bot place stone close to house (stone everywhere red winner)', done => {
        let bot = new Bot(false);
        let fakeValue = 0;
        let stone1 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone1.mesh.position.set(0, 0, 75);
        let stone2 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone2.mesh.position.set(0, 0, 1220);
        let stone3 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone3.mesh.position.set(0, 0, 1100);
        let stone4 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone4.mesh.position.set(-55, 0, 1250);
        let stone5 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone5.mesh.position.set(45, 0, 1050);
        let stone6 = new Stone(new THREE.Object3D(), "red", fakeValue++);
        stone6.mesh.position.set(30, 0, 1080);
        let stone7 = new Stone(new THREE.Object3D(), "yellow", fakeValue++);
        stone7.mesh.position.set(-25, 0, 1210);

        let onIce = [];
        onIce.push(stone1);
        onIce.push(stone2);
        onIce.push(stone3);
        onIce.push(stone4);
        onIce.push(stone5);
        onIce.push(stone6);
        onIce.push(stone7);

        let inHouse = [];
        inHouse.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });
        inHouse.push({ stoneOnIce: stone7, dist: fakeValue, color: stone7.color });

        let scoring = [];
        scoring.push({ stoneOnIce: stone2, dist: fakeValue, color: stone2.color });

        let decidedVector = bot.getDirectionVector(inHouse, onIce, scoring);
        let final = new THREE.Vector3(18.04, 0, 1220);
        let direction = new THREE.Vector3().subVectors(final, bot.startingPosition).normalize();
        expect(decidedVector).to.deep.equal(direction);
        done();
    });
});
