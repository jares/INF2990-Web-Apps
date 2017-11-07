import { Injectable } from '@angular/core';
import { Offside } from '../classes/offside';
import { Physics } from '../classes/physics';
import { GameAudio } from '../classes/audio';
import { Camera } from '../classes/camera';
import { ObjectLoader } from '../classes/objectLoader';
import { Score } from '../classes/score';
import { GameCelebration } from '../classes/gameCelebration';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Stone } from '../classes/stone';
import { Broom } from '../classes/broom';

const RADIUS = 4.51;
//Toutes les distances ont été prises dans les reglements officiels de curling canada
const DISTANCE_HOUSE_END = 160;
const DISTANCE_HOGLINE_END = 370;
const ICE_LENGTH = 1380;
const ICE_WIDTH = 140;
const STONE_ON_SIDE_OFFSET = 75;
const STONE_START_Z = 75;
const BROOM_NOT_IN_PLAY = 1000;
const NSTONE = 8;
const MAX_LINE_ANGLE = 15 * (Math.PI / 180);

@Injectable()
export class SceneUpdateService {

    scene: THREE.Scene;

    gameAudio: GameAudio;
    offside: Offside;
    physics: Physics;
    score: Score;
    objectLoader: ObjectLoader;
    gameCelebration: GameCelebration;
    camera: Camera;

    yellowStones: Stone[];
    redStones: Stone[];
    stonesOnIce: Stone[];
    movingStones: Stone[];

    currentStoneOnIce: Stone;
    mouse: any;
    direction: THREE.Vector3;
    posMouseOnIce: THREE.Vector3;
    rayCast: THREE.Raycaster;

    speed: number;
    spinVelocity: number;
    frictionCounter: number;
    nSet: number;
    dashSizeFactor: number;

    endTurn$: Observable<boolean>;
    private isEndTurn: Subject<boolean>;

    isRotating: boolean;
    isMoving: boolean;
    isHit: boolean;
    isOnIce: boolean;
    isCelebration: boolean;
    isDoingFadeout: boolean;
    isSetThrow: boolean;
    isMaxDashLine: boolean;
    broom: Broom;

    constructor() {
        this.isEndTurn = new Subject<boolean>();
        this.endTurn$ = this.isEndTurn.asObservable();
    }

    public init(scene: THREE.Scene): void {
        this.scene = scene;
        this.mouse = new THREE.Vector2();
        this.rayCast = new THREE.Raycaster();

        this.gameAudio = GameAudio.getInstance();
        this.offside = new Offside();
        this.physics = new Physics(ICE_LENGTH);
        this.score = new Score();
        this.objectLoader = new ObjectLoader(this.scene);
        this.gameCelebration = new GameCelebration(this.scene);
        this.camera = new Camera();

        this.redStones = [];
        this.yellowStones = [];
        this.stonesOnIce = [];
        this.movingStones = [];

        this.speed = 1.5;
        this.frictionCounter = 0;
        this.dashSizeFactor = 0;

        this.isMoving = false;
        this.isRotating = false;
        this.isHit = false;
        this.isCelebration = false;

        this.isDoingFadeout = false;
        this.isSetThrow = false;

        this.spinVelocity = 0;
        this.direction = new THREE.Vector3(0, 0, 1);
        this.nSet = 0;
        this.broom = new Broom(this.scene);
        this.objectLoader.loadScene();
        this.objectLoader.setStone(this.yellowStones, this.redStones, NSTONE);
    }

    public throwingStone(): void { // Pour partir le mouvement d'une pierre
        this.updateStoneParameters();
        this.isMoving = true;
        this.removeLights(this.stonesOnIce);
        if (this.objectLoader.dashedLine !== null) {
            this.scene.remove(this.objectLoader.dashedLine);
        }
    }

    public onMouseMove(event: any): void {
        this.mouse.x = ((event.clientX / window.innerWidth) * 2 - 1) * -550;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        if (this.mouse.x < ICE_LENGTH * Math.tan(MAX_LINE_ANGLE)
            && this.mouse.x > -ICE_LENGTH * Math.tan(MAX_LINE_ANGLE)) {
            this.mouse.y = ICE_LENGTH;
            if (ICE_WIDTH / 2 < Math.abs(this.mouse.x)) {
                this.mouse.y = ICE_LENGTH * ((ICE_WIDTH / 2) / Math.abs(this.mouse.x));
                this.mouse.x = (ICE_WIDTH / 2 < this.mouse.x) ? (ICE_WIDTH / 2) : (ICE_WIDTH / 2 * -1);
            }
            else {
                this.mouse.y = this.verifyStoneInTheWay(this.mouse.x);
            }
            this.posMouseOnIce = new THREE.Vector3(this.mouse.x, 0, this.mouse.y);
            this.objectLoader.addDashedLine(this.posMouseOnIce);
        }
    }


    public updateBroomPos(event: any, domElement: HTMLCanvasElement): void {
        this.broom.setPosition(new THREE.Vector3((
            event.clientX - domElement.offsetLeft) / domElement.width * 2 - 1,
            -(event.clientY - domElement.offsetTop) / domElement.height * 2 + 1,
            0.5));
    }

    public broomOnMouse(): void {
        let mouse3D = this.broom.getPosition().clone();
        mouse3D.unproject(this.camera.activeCamera);
        mouse3D.sub(this.camera.activeCamera.position);
        mouse3D.normalize();
        let rayCast = new THREE.Raycaster();
        rayCast.setFromCamera(mouse3D, this.camera.activeCamera);
        let intersects = rayCast.intersectObject(this.scene, true);
        let position = new THREE.Vector3(0, 0, ICE_LENGTH - DISTANCE_HOUSE_END);
        if (intersects.length > 0) {
            position = new THREE.Vector3(-intersects[0].point.x, 0, intersects[0].point.z);
        }
        if (this.currentStoneOnIce.color === "red") {
            this.broom.sweepBroom(position, this.movingStones);
        }
    }

    public updateDashLine(): void {
        if (this.dashSizeFactor > 100) {
            this.isMaxDashLine = false;
        }
        else if (this.dashSizeFactor <= 0) {
            this.isMaxDashLine = true;
        }
        if (this.isMaxDashLine) {
            ((this.objectLoader.dashedLine.material) as THREE.LineDashedMaterial).gapSize += 0.01;
            this.dashSizeFactor++;
        }
        else {
            ((this.objectLoader.dashedLine.material) as THREE.LineDashedMaterial).gapSize -= 0.01;
            this.dashSizeFactor--;
        }
    }

    public verifyStoneInTheWay(mouseX: number): number {
        let maxDistance = ICE_LENGTH;
        for (let stoneOnIce of this.stonesOnIce) {
            if (stoneOnIce.mesh.position.z !== 75
                && stoneOnIce.mesh.position.x + stoneOnIce.radius > mouseX
                && stoneOnIce.mesh.position.x - stoneOnIce.radius < mouseX
                && stoneOnIce.mesh.position.z < maxDistance) {
                maxDistance = stoneOnIce.mesh.position.z;
            }
        }
        return maxDistance;
    }

    public moveStone(): void {
        if (this.currentStoneOnIce.color === "red") {
            this.broomOnMouse();
        }
        let self = this;
        if (this.movingStones.length === 0) {
            this.isMoving = false;
            this.isOnIce = false;
            this.isEndTurn.next(true);
            this.illuminateStones(this.score.getScoringStones(this.stonesOnIce));
        }
        else {
            for (let movingStone of this.movingStones) {
                if (movingStone.getSpeed() <= 0) {
                    movingStone.setSpeed(0);
                    movingStone.stoneThrown = false;
                    this.gameAudio.stopGlide();
                    if (this.offside.verifyHogLine(movingStone.mesh.position.z, movingStone.radius)) {
                        if (movingStone.promiseCounter === 0) {
                            //Le promise counter empeche d'entrer dans la fonction plus d'une fois
                            movingStone.stoneThrown = false;
                            this.gameAudio.stopGlide();
                            let promise = this.offside.fadeoutPromise(movingStone);
                            promise.then(function (isDone) {
                                self.removeStone(movingStone);
                            });
                            movingStone.promiseCounter++;
                        }
                    }
                    else {
                        let indexMoving = this.movingStones.indexOf(movingStone);
                        this.movingStones.splice(indexMoving, 1);
                    }
                }
                else {
                    movingStone.move(this.gameAudio, this.physics, this.spinVelocity);
                    if (this.offside.offsideMoving(movingStone)) {
                        if (movingStone.promiseCounter === 0) {
                            movingStone.stoneThrown = false;
                            this.gameAudio.stopGlide();
                            let promise1 = this.offside.fadeoutPromise(movingStone);
                            promise1.then(function (isDone) {
                                self.removeStone(movingStone);
                            });
                            movingStone.promiseCounter++;
                        }
                    }
                    for (let stoneOnIce of this.stonesOnIce) {
                        if (stoneOnIce !== movingStone && this.physics.collision(movingStone, stoneOnIce)) {
                            this.movingStones.push(stoneOnIce);
                        }
                    }
                    this.camera.followCamera(movingStone);
                }
            }
        }
    }

    public illuminateStones(winningStones: { stoneOnIce: Stone, dist: number, color: string }[]): void {
        if (winningStones !== null) {
            for (let stoneScoring of winningStones) {
                stoneScoring.stoneOnIce.illuminate();
            }
        }
    }

    public removeLights(stones: Stone[]): void {
        if (stones !== null) {
            for (let stone of stones) {
                stone.removeLight();
            }
        }
    }

    public removeStone(movingStone: any): void {
        if (movingStone.stoneThrown) {
            this.gameAudio.stopGlide();
        }
        let indexMoving1 = this.movingStones.indexOf(movingStone);
        this.movingStones.splice(indexMoving1, 1);
        let indexOnIce = this.stonesOnIce.indexOf(movingStone);
        this.stonesOnIce.splice(indexOnIce, 1);
    }

    public updateStoneParameters(): void {
        this.currentStoneOnIce.setDirection(this.direction);
        this.currentStoneOnIce.setSpeed(this.speed);
        this.currentStoneOnIce.stoneThrown = true;
    }

    public reset(stones: any[], isYellow: boolean): void {
        let z = STONE_ON_SIDE_OFFSET;
        this.removeLights(stones);
        this.scene.getObjectByName("skybox").rotation.y += Math.PI / 2;
        for (let currentStone of stones) {
            currentStone.mesh.position.x = (isYellow) ? -STONE_ON_SIDE_OFFSET : STONE_ON_SIDE_OFFSET;
            currentStone.mesh.position.y = 0;
            currentStone.mesh.position.z = z;
            currentStone.promiseCounter = 0;
            for (let i = 0; i < 3; i++) {
                (currentStone.mesh.children[0].children[i] as THREE.Mesh).material.opacity = 1;
            }
            z = z + Math.ceil(RADIUS * 2);
        }
        this.isOnIce = false;
        this.movingStones.length = 0;
        this.stonesOnIce.length = 0;
    }

    public putStoneOnIce(isYellowTurn: boolean, indexRed: number, indexYellow: number): void {
        this.stopCelebration();
        this.camera.positionCamera(new THREE.Vector3(0, 50, -75));
        this.camera.isOrthoView = false;
        if (isYellowTurn) {
            this.scene.getObjectByName("broom").position.set(0, BROOM_NOT_IN_PLAY, 0);
            this.currentStoneOnIce = this.yellowStones[indexYellow];
            this.currentStoneOnIce.mesh.rotateZ(-Math.PI / 2);
        }
        else {
            this.currentStoneOnIce = this.redStones[indexRed];
        }
        this.gameAudio.playOrgue(isYellowTurn);
        this.gameAudio.stopOrgue(isYellowTurn);
        this.currentStoneOnIce.mesh.rotation.z = (Math.PI / 2);
        this.currentStoneOnIce.mesh.position.set(0, 0, STONE_START_Z);
        this.currentStoneOnIce.direction = new THREE.Vector3(0, 0, 1);
        this.movingStones.push(this.currentStoneOnIce);
        this.stonesOnIce.push(this.currentStoneOnIce);
        this.isOnIce = true;
    }

    public stopCelebration(): void {
        this.isCelebration = false;
        this.gameCelebration.reset(this.redStones);
    }

    public startCelebration(): void {
        this.isCelebration = true;
        this.isOnIce = false;
        this.camera.positionCamera(new THREE.Vector3(0, 50, ICE_LENGTH - DISTANCE_HOGLINE_END));
        this.camera.activeCamera.lookAt(new THREE.Vector3(0, 0, ICE_LENGTH - DISTANCE_HOUSE_END));
    }

    public toggleRotation(): void {
        if (this.isRotating) {
            this.removeRotation();
        }
        else {
            this.isRotating = true;
            this.spinVelocity = -0.5;
        }
    }

    public rotate(): void {
        this.currentStoneOnIce.mesh.rotation.z += this.spinVelocity * Math.PI / 180;
    }

    public resetStones(): void {
        let isYellow = true;
        this.reset(this.yellowStones, isYellow);
        this.reset(this.redStones, !isYellow);
    }

    public getStonesOnIce(): any[] {
        return this.stonesOnIce;
    }

    public removeRotation(): void {
        this.spinVelocity = 0;
        this.isRotating = false;
    }

    public update(): void {
        if (this.objectLoader.dashedLine !== undefined) {
            this.updateDashLine();
        }
        this.camera.setCamera(this.isMoving, this.currentStoneOnIce, this.isOnIce);
        if (this.isCelebration) {
            this.camera.activeCamera = this.camera.perspectiveCamera;
            this.gameCelebration.update();
            this.gameCelebration.jumpStone(this.redStones);
            this.gameAudio.playCelebration();
        }
        else {
            this.gameAudio.stopCelebration();
        }
        if (this.isMoving) {
            this.moveStone();
            if (this.isRotating) {
                this.rotate();
            }
        }
        if (this.objectLoader.video.readyState === this.objectLoader.video.HAVE_ENOUGH_DATA) {
            this.objectLoader.videoImageContext.drawImage(this.objectLoader.video, 0, 0);
            if (this.objectLoader.videoTexture) {
                this.objectLoader.videoTexture.needsUpdate = true;
            }
        }
    }

    public getActiveCamera(): THREE.Camera {
        return this.camera.activeCamera;
    }

    public updateMouse(e: MouseEvent, domElement: HTMLCanvasElement): void {
        if (this.isSetThrow) {
            this.onMouseMove(e);
        }
        else if (this.isMoving && this.currentStoneOnIce.color !== "yellow") {
            this.updateBroomPos(e, domElement);
        }
    }

    public updateCamera(): void {
        this.camera.toggleOrthogonalCam();
        this.camera.setCamera(this.isMoving, this.currentStoneOnIce, this.isOnIce);
    }
}
