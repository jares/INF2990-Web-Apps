import { GameAudio } from './audio';
import { Physics } from './physics';

const RADIUS = 4.51;
const ICE_LENGTH = 1380;
const DISTANCE_HOUSELINE_END = 100;
const DISTANCE_HOGLINE_END = 370;
const RED_BROOM = 0xFF0000;
const GREEN = 0x00B133;

export class Broom {
    public isBroomGoingLeft: boolean;
    public isBroomMoving: boolean;
    public checkSweep: boolean;

    private broomOffset: number;
    private position: THREE.Vector3;
    private scene: any;
    private gameAudio: GameAudio;
    private physics: Physics;

    constructor(scene: any) {
        this.scene = scene;
        this.broomOffset = 0;
        this.isBroomMoving = false;
        this.isBroomGoingLeft = false;
        this.physics = new Physics(ICE_LENGTH);
        this.gameAudio = GameAudio.getInstance();
    }

    public isValidSweep(broomPosition: THREE.Vector3, movingStones: any[]): boolean {
        let isValidSweep = false;
        for (let i = 0; i < movingStones.length; i++) {
            let positionStone = movingStones[i].mesh.position;
            let directionStone = movingStones[i].direction.clone();
            let distanceBroomMax = new THREE.Vector3().addVectors(positionStone, directionStone.multiplyScalar(50));
            let distance = new THREE.Vector3().subVectors(broomPosition, positionStone);
            let distanceSide = this.distanceToVector(positionStone, distanceBroomMax, broomPosition);
            let isCloseToStone = Math.abs(broomPosition.x) < distanceBroomMax.x || broomPosition.z < distanceBroomMax.z;
            let isBeforeBroom = Math.abs(distance.x) > 0 || distance.z > 0;
            isValidSweep = isCloseToStone && isBeforeBroom && (distanceSide <= 2 * RADIUS);
        }
        return isValidSweep;
    }

    public sweepBroom(position: THREE.Vector3, movingStones: any[]): void {
        let broomPosition = this.scene.getObjectByName("broom").position;
        this.checkSweep = this.checkIfCanSweep(this.scene, position);
        if (this.isBroomMoving) {
            if (this.isValidSweep(broomPosition, movingStones)) {
                this.physics.reduceFriction(broomPosition);
            }
            if (this.isBroomGoingLeft) {
                if (this.broomOffset >= 2 * RADIUS) {
                    this.isBroomMoving = false;
                    this.gameAudio.stopBroom();
                }
                else {
                    this.broomOffset += 0.3;
                    this.gameAudio.playBroom();
                }
            }
            else {
                this.broomOffset -= 0.3;
                this.gameAudio.playBroom();
                if (this.broomOffset <= 0) {
                    this.gameAudio.stopBroom();
                    this.isBroomMoving = false;
                }
            }
        }
        broomPosition.set(position.x + this.broomOffset, position.y, position.z);
    }

    public getPosition(): THREE.Vector3 {
        return this.position;
    }

    public setPosition(position: THREE.Vector3): void {
        this.position = position.clone();
    }

    private distanceToVector(start: THREE.Vector3, end: THREE.Vector3, point: THREE.Vector3): any {
        return Math.abs((end.z - start.z) * point.x - (end.x - start.x) * point.z + end.x * start.z - end.z * start.x) /
            Math.sqrt(Math.pow(end.z - start.z, 2) + Math.pow(end.x - start.x, 2));
    }

    private changeBroomColor(scene: any, color: any): void {
        let broom = scene.getObjectByName("broom");
        ((broom.getObjectByName("Handle") as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive.setHex(color);
        ((broom.getObjectByName("Bolts") as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive.setHex(color);
        ((broom.getObjectByName("Brushs") as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive.setHex(color);
    }

    private checkIfCanSweep(scene: any, position: THREE.Vector3): boolean {
        if (position.z > DISTANCE_HOGLINE_END) {
            if (position.z < ICE_LENGTH - DISTANCE_HOUSELINE_END) {
                this.changeBroomColor(scene, GREEN);
                return true;
            }
            else {
                this.changeBroomColor(scene, RED_BROOM);
                return false;
            }
        }
        else {
            this.changeBroomColor(scene, RED_BROOM);
            return false;
        }
    }
}
