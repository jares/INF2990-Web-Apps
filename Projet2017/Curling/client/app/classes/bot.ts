import { Physics } from './physics';
import { Stone } from './stone';

const DISTANCE_HOGLINE_END = 370;
const ICE_LENGTH = 1380;
const ICE_WIDTH = 140;
const INNER_BUTTON_Z = 1380 - 160;
const STONE_RADIUS = 4.51;
const INNER_RING_RADIUS = 20;
const OUTER_RING_RADIUS = 60;
const KNOCK_ADDER = 0.5;
const IN_HOUSE_PROBABILITY = 0.7;
const IN_FRONT_HOUSE_PROBABILITY = 0.9;
const TOWARDS_THE_RIGHT_PROBABILITY = 0.5;
const STONE_START_Z = 75;

export class Bot {
    private isNormalDifficulty: boolean;
    public startingPosition: THREE.Vector3;
    public finalPosition: THREE.Vector3;
    private physics: Physics;
    private speed: number;

    constructor(isNormalDifficulty: boolean) {
        this.isNormalDifficulty = isNormalDifficulty;
        this.startingPosition = new THREE.Vector3(0, 0, STONE_START_Z); // position de la pierre avant un tir
        this.finalPosition = new THREE.Vector3(0, 0, INNER_BUTTON_Z); // milieu du bouton
        this.physics = new Physics(ICE_LENGTH);
        this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition);
    }

    public getSpeed(): number {
        return this.speed;
    }

    public getDirectionVector(
        stonesInHouse: { stoneOnIce: Stone, dist: number, color: string }[],
        stonesOnIce: Stone[],
        scoringStones: { stoneOnIce: Stone, dist: number, color: string }[]): THREE.Vector3 {
        this.finalPosition.set(0, 0, INNER_BUTTON_Z); // milieu du bouton
        if (this.isNormalDifficulty) {
            this.getFinalPositionNormalBot(stonesOnIce);
        }
        else if (stonesOnIce.length > 1) {
            if (this.checkStraightThrow(stonesOnIce)) {
                this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition);
            }
            else if (stonesInHouse.length === stonesOnIce.length - 1) {
                this.getVectorAllStonesInHouse(stonesInHouse, scoringStones);
            }
            else if (stonesInHouse.length === 0) {
                this.getVectorAllStonesOutHouse(stonesOnIce);
            }
            else {
                this.getVectorStoneEverywhere(stonesOnIce, stonesInHouse, scoringStones);
            }
        }
        let direction = new THREE.Vector3().subVectors(this.finalPosition, this.startingPosition).normalize();
        return direction;
    }

    public getVectorAllStonesInHouse(
        stonesInHouse: { stoneOnIce: Stone, dist: number, color: string }[],
        scoringStones: { stoneOnIce: Stone, dist: number, color: string }[]): void {
        let stones = [];
        let redStones: THREE.Mesh[];
        redStones = [];
        let yellowStones: THREE.Mesh[];
        yellowStones = [];
        for (let object of stonesInHouse) {
            stones.push(object.stoneOnIce);
        }
        this.sortStonesInHouseByColor(stonesInHouse, redStones, yellowStones, scoringStones);
        this.compareKnockAndPan(stones, redStones, yellowStones);
    }

    public checkStraightThrow(stonesOnIce: Stone[]): boolean {
        for (let object of stonesOnIce) {
            if (object.mesh.position.z !== STONE_START_Z && Math.abs(object.mesh.position.x) <= STONE_RADIUS * 2
                && object.mesh.position.z < INNER_BUTTON_Z + 2 * STONE_RADIUS) {
                return false;
            }
        }
        this.finalPosition = new THREE.Vector3(0, 0, INNER_BUTTON_Z);
        this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition);
        return true;
    }

    public checkClearRoute(stones: Stone[], aimingAtStone: boolean): boolean {
        let direction = new THREE.Vector3().subVectors(this.finalPosition, this.startingPosition).normalize();
        direction.multiplyScalar(STONE_RADIUS * 2);
        let angle = direction.angleTo(new THREE.Vector3(0, 0, 1));
        let xValue = (ICE_LENGTH - DISTANCE_HOGLINE_END - this.startingPosition.z) * Math.tan(angle);
        if (direction.x < 0) {
            xValue = -xValue;
        }
        let positionOnHogLine = new THREE.Vector3(xValue, 0, ICE_LENGTH - DISTANCE_HOGLINE_END);
        let currentPosition = positionOnHogLine;
        let uncheckedStones = [];
        for (let object of stones) {
            uncheckedStones.push(object.mesh);
        }
        let counter = 0;
        while (counter < 2) { // regarde une seule position plus loin que le goal
            for (let stone of uncheckedStones) {
                if (!(aimingAtStone && this.finalPosition.equals(stone.position))
                    && currentPosition.distanceTo(stone.position) <= STONE_RADIUS * 2) {
                    return false;
                }
            }
            currentPosition.add(direction);
            if (currentPosition.z + STONE_RADIUS > this.finalPosition.z - STONE_RADIUS) {
                counter++;
            }
        }
        return true;
    }

    public getVectorAllStonesOutHouse(stones: Stone[]): void {
        let hasFoundFinalPosition = this.pan(stones);
        if (!hasFoundFinalPosition) {
            let yellowStones = [];
            let redStones = [];
            for (let object of stones) {
                (object.color === "yellow") ? yellowStones.push(object.mesh) : redStones.push(object.mesh);
            }
            if (yellowStones.length > 1) {
                hasFoundFinalPosition = this.knockStones(stones, yellowStones);
            }
            if (!hasFoundFinalPosition) {
                this.knockStones(stones, redStones);
            }
        }
    }

    private knockStones(stones: Stone[], colorStones: THREE.Mesh[]): boolean {
        colorStones.sort(function (a: THREE.Mesh, b: THREE.Mesh) {
            return a.position.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z))
                - b.position.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z)); //ordre croissant
        });
        for (let stone of colorStones) {
            this.finalPosition = stone.position.clone();
            if (this.checkClearRoute(stones, true)) {
                this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition) + KNOCK_ADDER;
                return true;
            }
        }
        return false;
    }

    private pan(stones: Stone[]): boolean {
        let hasFoundFinalPosition = false;
        let rightStones = 0;
        let leftStones = 0;
        for (let object of stones) {
            (object.mesh.position.x > 0) ? leftStones++ : rightStones++;
        }
        let isLeftFirst = leftStones < rightStones;
        this.finalPosition = new THREE.Vector3(0, 0, INNER_BUTTON_Z); // milieu du bouton
        while (!hasFoundFinalPosition && Math.abs(this.finalPosition.x) <= OUTER_RING_RADIUS) {
            this.finalPosition.x += isLeftFirst ? STONE_RADIUS * 2 : STONE_RADIUS * -2;
            for (let i = 0; i < 2 && !hasFoundFinalPosition; i++) {
                if (this.checkClearRoute(stones, false)) {
                    hasFoundFinalPosition = true;
                }
                else {
                    this.finalPosition.x = -this.finalPosition.x;
                }
            }
        }
        this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition);
        return hasFoundFinalPosition;
    }

    private getVectorStoneEverywhere(
        stonesOnIce: Stone[],
        stonesInHouse: { stoneOnIce: Stone, dist: number, color: string }[],
        scoringStones: { stoneOnIce: Stone, dist: number, color: string }[]): void {
        let redStones: THREE.Mesh[];
        redStones = [];
        let yellowStones: THREE.Mesh[];
        yellowStones = [];
        this.sortStonesInHouseByColor(stonesInHouse, redStones, yellowStones, scoringStones);
        this.compareKnockAndPan(stonesOnIce, redStones, yellowStones);
    }

    private compareKnockAndPan(stones: Stone[], redStones: THREE.Mesh[], yellowStones: THREE.Mesh[]): void {
        let canPan = this.pan(stones);
        let panPosition = this.finalPosition.clone();
        let panSpeed = this.speed;
        let canKnockRed = this.knockStones(stones, redStones);
        let knockRedPosition = this.finalPosition.clone();
        let knockRedSpeed = this.speed;
        let canKnockYellow = this.knockStones(stones, yellowStones);
        let knockYellowPosition = this.finalPosition.clone();
        let knockYellowSpeed = this.speed;
        let panIsSmallerKnockRed = panPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z)) <
            knockRedPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z));
        let panIsSmallerKnockYellow = panPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z)) <
            knockYellowPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z));
        let redSmallestKnock = knockRedPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z)) <
            knockYellowPosition.distanceTo(new THREE.Vector3(0, 0, INNER_BUTTON_Z));
        if (canKnockRed && canPan && canKnockYellow) {
            if (panIsSmallerKnockRed && panIsSmallerKnockYellow) {
                this.finalPosition = panPosition;
                this.speed = panSpeed;
            }
            else if (redSmallestKnock) {
                this.finalPosition = knockRedPosition;
                this.speed = knockRedSpeed;
            }
            else if (panIsSmallerKnockYellow) {
                this.finalPosition = panPosition;
                this.speed = panSpeed;
            }
            else {
                this.finalPosition = knockYellowPosition;
                this.speed = knockYellowSpeed;
            }
        }
        else if (canKnockRed && canKnockYellow) {
            if (redSmallestKnock) {
                this.finalPosition = knockRedPosition;
                this.speed = knockRedSpeed;
            }
            else {
                this.finalPosition = knockYellowPosition;
                this.speed = knockYellowSpeed;
            }
        }
        else if (canPan && canKnockRed) {
            if (panIsSmallerKnockRed) {
                this.finalPosition = panPosition;
                this.speed = panSpeed;
            }
            else {
                this.finalPosition = knockRedPosition;
                this.speed = knockRedSpeed;
            }
        }
        else if (canPan && canKnockYellow) {
            if (panIsSmallerKnockYellow) {
                this.finalPosition = panPosition;
                this.speed = panSpeed;
            }
            else {
                this.finalPosition = knockYellowPosition;
                this.speed = knockYellowSpeed;
            }
        }
        else if (canPan) {
            this.finalPosition = panPosition;
            this.speed = panSpeed;
        }
        else if (canKnockRed) {
            this.finalPosition = knockRedPosition;
            this.speed = knockRedSpeed;
        }
        else {
            this.finalPosition = knockYellowPosition;
            this.speed = knockYellowSpeed;
        }
    }

    private sortStonesInHouseByColor(
        stonesInHouse: { stoneOnIce: Stone, dist: number, color: string }[],
        redStones: THREE.Mesh[],
        yellowStones: THREE.Mesh[],
        scoringStones: { stoneOnIce: Stone, dist: number, color: string }[]): void {
        for (let object of stonesInHouse) {
            if (object.color === "red") {
                redStones.push(object.stoneOnIce.mesh);
            }
            else {
                yellowStones.push(object.stoneOnIce.mesh);
            }
        }
        if (scoringStones.length !== 0 && scoringStones[0].color === "yellow") {
            this.removeYellowScoringStones(yellowStones, scoringStones);
        }
    }
    private removeYellowScoringStones(
        yellowStones: THREE.Mesh[],
        scoringStones: { stoneOnIce: Stone, dist: number, color: string }[]): void {
        for (let object of scoringStones) {
            let index = 0;
            index = yellowStones.indexOf(object.stoneOnIce.mesh, 0);
            if (index > -1) {
                yellowStones.splice(index, 1);
            }
        }
    }

    private getFinalPositionNormalBot(stonesOnIce: Stone[]): void {
        if (this.checkStraightThrow(stonesOnIce)) {
            let xPosition = this.getRandomPosition(INNER_RING_RADIUS, -INNER_RING_RADIUS);
            this.finalPosition.set(xPosition, 0, INNER_BUTTON_Z);
        }
        else {
            let decision = Math.random();
            if (decision < IN_HOUSE_PROBABILITY) { // in house
                let middleRing = (OUTER_RING_RADIUS + INNER_RING_RADIUS) / 2;
                this.finalPosition.z = this.getRandomPosition(INNER_BUTTON_Z + middleRing, INNER_BUTTON_Z - middleRing);
                this.finalPosition.x = this.getRandomPosition(middleRing, -middleRing);
            }
            else if (decision < IN_FRONT_HOUSE_PROBABILITY) { // in front house
                this.finalPosition.z = this.getRandomPosition(INNER_BUTTON_Z - OUTER_RING_RADIUS,
                    ((INNER_BUTTON_Z - OUTER_RING_RADIUS - (ICE_LENGTH - DISTANCE_HOGLINE_END)) / 2)
                    + ICE_LENGTH - DISTANCE_HOGLINE_END);
                this.finalPosition.x = this.getRandomPosition(ICE_WIDTH / 2, -ICE_WIDTH / 2);
            }
            else { // stone out
                this.finalPosition.z = this.getRandomPosition(ICE_LENGTH, DISTANCE_HOGLINE_END);
                if (Math.random() < TOWARDS_THE_RIGHT_PROBABILITY) {
                    this.finalPosition.x = -ICE_WIDTH / 2;
                }
                else {
                    this.finalPosition.x = ICE_WIDTH / 2;
                }
            }
        }
        this.speed = this.physics.getMinSpeedToHit(this.finalPosition, this.startingPosition);
    }

    private getRandomPosition(max: number, min: number): number {
        return Math.random() * (max - min) + min;
    }
}
