import { Physics } from '../classes/physics';
import { expect } from 'chai';
import { Stone } from '../classes/stone';

const ICE_LENGTH = 1380;

describe('Physics tests', () => {
    let physics: Physics;

    let geometryRed: THREE.SphereGeometry;
    let sphereRed: THREE.Mesh;
    let radiusStoneRed: number;
    let hitStoneRed: boolean;
    let stoneDirectionRed: THREE.Vector3;
    let stoneBeingThrownRed: boolean;
    let speedStoneRed: number;
    let promiseCountRed: number;

    let geometryYellow: THREE.SphereGeometry;
    let sphereYellow: THREE.Mesh;
    let radiusStoneYellow: number;
    let hitStoneYellow: boolean;
    let stoneDirectionYellow: THREE.Vector3;
    let stoneBeingThrownYellow: boolean;
    let speedStoneYellow: number;
    let promiseCountYellow: number;
    beforeEach(() => {
        physics = new Physics(ICE_LENGTH);

        geometryRed = new THREE.SphereGeometry(5, 32, 32);
        sphereRed = new THREE.Mesh(geometryRed);
        radiusStoneRed = 4.500247917274692;
        hitStoneRed = false;
        stoneDirectionRed = new THREE.Vector3(0, 0, 1);
        stoneBeingThrownRed = false;
        speedStoneRed = 0;
        promiseCountRed = 0;

        geometryYellow = new THREE.SphereGeometry(5, 32, 32);
        sphereYellow = new THREE.Mesh(geometryRed);
        radiusStoneYellow = 4.500247917274692;
        hitStoneYellow = false;
        stoneDirectionYellow = new THREE.Vector3(0, 0, 1);
        stoneBeingThrownYellow = false;
        speedStoneYellow = 0;
        promiseCountYellow = 0;
    });

    it(' test collison, une collision a lieu', done => {
        let redStone1 = new Stone((sphereRed as THREE.Mesh), "red", 0);
        redStone1.mesh.position.z = 495;
        let yellowStone = new Stone((sphereYellow as THREE.Mesh), "yellow", 1);
        yellowStone.mesh.position.z = 500;
        let isCollide = physics.collision(redStone1, yellowStone);
        expect(isCollide).to.deep.equal(true);
        done();
    });

    it(' test collison, une collision n a pas lieu à cause de position différente', done => {
        let redStone1 = new Stone((sphereRed as THREE.Mesh), "red", 2);
        redStone1.mesh.position.z = 0;
        let yellowStone = new Stone((sphereYellow as THREE.Mesh), "yellow", 3);
        yellowStone.mesh.position.z = 500;
        let isCollide = physics.collision(redStone1, yellowStone);
        expect(isCollide).to.deep.equal(false);
        done();
    });

    it(' test collison, une double collision n a pas lieu', done => {
        let redStone1 = new Stone((sphereYellow as THREE.Mesh), "red", 4);
        redStone1.mesh.position.z = 495;
        let yellowStone = new Stone((sphereYellow as THREE.Mesh), "yellow", 5);
        yellowStone.mesh.position.z = 500;
        physics.collision(redStone1, yellowStone);
        let isCollide = physics.collision(redStone1, yellowStone);
        expect(isCollide).to.deep.equal(false);
        done();
    });

    it('getZone retourne une zone existante', done => {
        let zone = physics.getZone(new THREE.Vector3(100, 0, 200));
        let exists = zone !== null;
        expect(exists).to.deep.equal(true);
        done();
    });

    it('getZone retourne une zone inexistante', done => {
        let zone = physics.getZone(new THREE.Vector3(100, 0, ICE_LENGTH + 1));
        let exists = zone !== null;
        expect(exists).to.deep.equal(false);
        done();
    });

    it('reduceFriction réduit la friction d une position', done => {
        let pos = new THREE.Vector3(100, 0, 200);
        let friction1 = physics.getZone(pos).friction;
        physics.reduceFriction(pos);
        let friction2 = physics.getZone(pos).friction;
        expect(friction1 > friction2).to.deep.equal(true);
        done();
    });

    it('reduceFriction ne réduit pas la friction d une position éloignée', done => {
        let pos = new THREE.Vector3(100, 0, 200);
        let friction1 = physics.getZone(pos).friction;
        physics.reduceFriction(new THREE.Vector3(5, 0, 220));
        let friction2 = physics.getZone(pos).friction;
        expect(friction1 === friction2).to.deep.equal(true);
        done();
    });

    it('friction, vitesse diminue', done => {
        speedStoneRed = 1;
        let redStone1 = new Stone((sphereYellow as THREE.Mesh), "red", 4);
        redStone1.speed = 1;
        redStone1.speed = physics.applyFriction(redStone1.speed, new THREE.Vector3());
        expect(redStone1.speed).to.deep.equal(0.999);
        done();
    });

    it('friction réduite, vitesse diminue', done => {
        speedStoneRed = 1;
        let redStone1 = new Stone((sphereYellow as THREE.Mesh), "red", 4);
        redStone1.speed = 1;
        let pos = new THREE.Vector3();
        physics.reduceFriction(pos);
        redStone1.speed = physics.applyFriction(redStone1.speed, pos);
        expect(redStone1.speed).to.deep.equal(1 - 0.001 * 0.8);
        done();
    });


    it('spin, courbe vers la droite', done => {
        let spinVelocity = -1.5;
        let redStone1 = new Stone((sphereYellow as THREE.Mesh), "red", 4);
        physics.spin(redStone1, spinVelocity);
        expect(redStone1.direction.x).to.deep.equal(-0.0001);
        done();
    });

    it('spin, courbe vers la gauche', done => {
        let spinVelocity = 1.5;
        let redStone1 = new Stone((sphereYellow as THREE.Mesh), "red", 4);
        physics.spin(redStone1, spinVelocity);
        expect(redStone1.direction.x).to.deep.equal(0.0001);
        done();
    });
});
