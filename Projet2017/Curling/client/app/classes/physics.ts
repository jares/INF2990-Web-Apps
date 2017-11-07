import { GameAudio } from './audio';
import { Stone } from './stone';

const NORMAL_FRICTION = 0.001;
const FRICTION_REDUCTION_COEFFICIENT = 0.8;
const RESTITUTION_COEFFICIENT = 0.8; //Permet un mouvement plus réaliste avec perte d'énergie
const ZONE_SIZE = 10;

export class Physics {
    private gameAudio: GameAudio;
    private lastCollision: { first: number, second: number };
    private iceFriction: number;
    private zones: { id: number, friction: number, timeoutID: any }[];

    constructor(icelength: number) {
        this.gameAudio = GameAudio.getInstance();
        this.lastCollision = { first: -1, second: -1 };
        this.iceFriction = NORMAL_FRICTION;
        this.zones = [];
        for (let i = 0; i < icelength / ZONE_SIZE; i++) {
            this.zones.push({ id: i, friction: NORMAL_FRICTION, timeoutID: null });
        }
    }

    public getZone(pos: THREE.Vector3): { id: number, friction: number, timeoutID: any } {
        let index = Math.floor(pos.z / ZONE_SIZE);
        if (index < 0 || index > this.zones.length - 1) {
            return null;
        }
        return this.zones[index];
    }

    public reduceFriction(pos: THREE.Vector3): void {
        let zone = this.getZone(pos);
        if (zone !== null) {
            clearTimeout(zone.timeoutID);
            zone.friction = NORMAL_FRICTION * FRICTION_REDUCTION_COEFFICIENT;

            zone.timeoutID = setTimeout(function () {
                zone.friction = NORMAL_FRICTION;
            }, 1000); //1 seconde
        }
    }

    public collision(movingStone: Stone, stoneOnIce: Stone): boolean {
        let a = stoneOnIce.getPosition().x - movingStone.getPosition().x;
        let b = stoneOnIce.getPosition().z - movingStone.getPosition().z;
        let distance = Math.sqrt(a * a + b * b);
        let sameAsLastCollision = movingStone.getId() === this.lastCollision.first
            && stoneOnIce.getId() === this.lastCollision.second;
        let rebound = movingStone.getId() === this.lastCollision.second
            && stoneOnIce.getId() === this.lastCollision.first;
        if ((movingStone.getRadius() + stoneOnIce.getRadius() > distance) && !rebound && !sameAsLastCollision) {
            stoneOnIce.getDirection().x = a / distance;
            stoneOnIce.getDirection().z = b / distance;
            if (movingStone.getPosition().x > stoneOnIce.getPosition().x) {
                movingStone.getDirection().x = ((b) / distance);
                movingStone.getDirection().z = -1 * (a / distance);
            }
            else if (movingStone.getPosition().x <= stoneOnIce.getPosition().x) {
                movingStone.getDirection().x = -1 * ((b) / distance);
                movingStone.getDirection().z = (a / distance);
            }
            this.lastCollision = { first: movingStone.getId(), second: stoneOnIce.getId() };
            this.gameAudio.playCollision(movingStone.speed);
            stoneOnIce.setSpeed(this.getCollisionSpeed(movingStone.getSpeed()));
            movingStone.setSpeed(movingStone.getSpeed() * 0.1);
            stoneOnIce.isHit = true;
            return true;
        }
        else {
            return false;
        }
    }

    public applyFriction(speed: number, pos: THREE.Vector3): number {
        let friction = this.getZone(pos).friction;
        speed -= friction;
        if (speed < 0) {
            speed = 0;
        }
        return speed;
    }

    public spin(movingStone: Stone, spinVelocity: number): void {
        if (spinVelocity > 0) {
            movingStone.getDirection().x += 0.0001;
        }
        else if (spinVelocity < 0) {
            movingStone.getDirection().x -= 0.0001;
        }
    }

    getCollisionSpeed(speed: number): number {
        // Selon la conservation de l'énergie kinétique avec objets de masses identiques
        let newSpeed = Math.sqrt(Math.pow(speed, 2) / 2);
        return newSpeed * RESTITUTION_COEFFICIENT;
    }

    getMinSpeedToHit(target: THREE.Vector3, from: THREE.Vector3): number {
        let direction = target.clone().sub(from);
        let cloneFrom = from.clone();
        direction.normalize();
        let speed = 0;
        while (cloneFrom.z < target.z) {
            cloneFrom.z += direction.z * speed;
            speed += NORMAL_FRICTION;
        }
        return speed;
    }
}
