import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { RenderService } from '../services/render.service';
import { DataService } from '../services/data.service';
import { UserCurling } from '../classes/userCurling';
import { Score } from '../classes/score';
import { Bot } from '../classes/bot';
import { Physics } from '../classes/physics';
import { SceneUpdateService } from '../services/sceneUpdate.service';

const CLOCKWISE = true;
const NSTONES = 8;
const NSET = 3;
const ICE_LENGTH = 1380;
const DISTANCE_HOUSELINE_END = 100;
const DISTANCE_HOGLINE_END = 370;
const STONE_ON_SIDE_OFFSET = 75;
const MIN_PROGRESSBAR = 1.3;


@Component({
    selector: 'my-scene',
    moduleId: module.id,
    templateUrl: '../../assets/templates/game-component-template.html',
    styleUrls: ['../../assets/stylesheets/game.component.css']
})

export class GameComponent implements OnInit, OnDestroy {
    public maxSpeed: number;
    public minSpeed: number;
    public speed: number;
    public nSetDone: number;
    public indexCurrentRedStone: number;
    public indexCurrentYellowStone: number;

    public cursor: string;

    public isClockwise: boolean;
    public isRotating: boolean;
    public isNewSet: boolean;
    public yellowHasHammer: boolean;
    public isEndTurn: boolean;
    public isStartGame: boolean;
    public isSetThrow: boolean;

    private scene: THREE.Scene;
    private step: number;
    private isEndGame: boolean;
    private isYellowTurn: boolean;
    private speedIsChanging: boolean;

    private score: Score;
    private bot: Bot;
    private subscription: any;
    private timer: any;
    private physics: Physics;

    constructor(private renderService: RenderService, private dataService: DataService,
        private router: Router, private sceneUpdateService: SceneUpdateService) {
        if (UserCurling.page !== 2) {
            console.log("game.component, page !== 2");
            this.router.navigate(['/login']);
        }
        else {
            console.log("game.component, page === 2");
            this.scene = new THREE.Scene();
            this.sceneUpdateService.init(this.scene);
            renderService.init(this.scene, this.sceneUpdateService.getActiveCamera());
        }
    }

    ngOnInit(): void {
        console.log("game.component, ngOnInit");
        if (UserCurling.page === 2) {
            console.log("game.component, ngOnInit page === 2");
            this.speed = MIN_PROGRESSBAR;
            this.nSetDone = 0;
            this.indexCurrentRedStone = 0;
            this.indexCurrentYellowStone = 0;
            this.step = 0.0025;

            this.isClockwise = true;
            this.isRotating = false;
            this.isEndGame = false;
            this.isNewSet = true;
            this.isStartGame = true;
            this.isEndTurn = true;
            this.isSetThrow = false;
            this.yellowHasHammer = false;
            this.bot = new Bot(UserCurling.normalAI);
            this.score = new Score();
            this.physics = new Physics(ICE_LENGTH);
            this.minSpeed = this.getSpeedLimits(true);
            this.maxSpeed = this.getSpeedLimits(false) + 0.1;
            this.randomizeStarter();

            this.subscription = this.sceneUpdateService.endTurn$.subscribe((newBool: boolean) => {
                this.isEndTurn = newBool;
                if (this.isEndTurn) {
                    this.cursor = "default";
                }
                if (this.indexCurrentRedStone === NSTONES && this.indexCurrentYellowStone === NSTONES) {
                    this.updateScore();
                }
            });
            this.animate();
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    @HostListener('mousemove', ['$event'])
    public mouseMove(e: MouseEvent): void {
        this.sceneUpdateService.updateMouse(e, this.renderService.getDomElement());
    }

    @HostListener('mousedown', ['$event'])
    public mouseDown(e: MouseEvent): void {
        if (e.button === 0) {
            if (this.isSetThrow) {
                //Il faut soustraire avec la position initiale de la pierre (0,0,75)
                this.sceneUpdateService.posMouseOnIce.z = this.sceneUpdateService.posMouseOnIce.z - 75;
                this.sceneUpdateService.direction = this.sceneUpdateService.posMouseOnIce.normalize();
                this.sceneUpdateService.isSetThrow = false;
                this.changeSpeed();
            }
            else if (!this.sceneUpdateService.broom.isBroomGoingLeft && this.sceneUpdateService.broom.checkSweep) {
                this.sceneUpdateService.broom.isBroomMoving = true;
                this.sceneUpdateService.broom.isBroomGoingLeft = true;
            }
        }
    }

    @HostListener('mouseup', ['$event'])
    public onMouseUp(e: MouseEvent): void {
        if (e.button === 0) {
            if (this.speedIsChanging) {
                clearInterval(this.timer);
                this.sceneUpdateService.speed = this.speed;
                this.isSetThrow = false;
                this.speedIsChanging = false;
                this.enableMoving();
            }
            else if (this.sceneUpdateService.broom.isBroomGoingLeft) {
                this.sceneUpdateService.broom.isBroomMoving = true;
                this.sceneUpdateService.broom.isBroomGoingLeft = false;
            }
        }
    }

    @HostListener('resize', ['$event'])
    public onresize(): void {
        this.renderService.onResize();
    }

    @HostListener('document:keyup', ['$event'])
    public onKey(event: any): void { // Va permettre de gerer les touches du clavier , mais juste camera pour l'instant
        if (event.keyCode === 84) { // T
            this.sceneUpdateService.updateCamera();
            this.renderService.activeCamera = this.sceneUpdateService.getActiveCamera();
        }
        else if (event.keyCode === 82 && this.isSetThrow) { // R
            this.changeRotation();
        }
        else if (event.keyCode === 83) { // S
            this.stopStone();
        }
        else if (event.keyCode === 67) { // C
            this.endGame();
        }
        else if (event.keyCode === 32) { // Space
            event.preventDefault();
            if (this.isStartGame) {
                this.startGame();
            }
            else if (this.isEndGame) {
                // pour bloquer
            }
            else if (this.isNewSet) {
                this.startSet();
            }
            else if (this.isEndTurn) {
                this.nextTurn();
            }
        }
        else if (event.keyCode === 80) { // P
            this.endSet();
        }
    }

    public startNewGame(): void {
        this.nSetDone = 0;
        this.indexCurrentRedStone = 0;
        this.indexCurrentYellowStone = 0;
        this.isEndGame = false;
        this.isEndTurn = true;
        this.isNewSet = true;
        this.isStartGame = true;
        this.isSetThrow = false;
        this.sceneUpdateService.resetStones();
        this.sceneUpdateService.stopCelebration();
        this.sceneUpdateService.camera.reset();
        this.randomizeStarter();
    }

    public toggleRotation(): void {
        if (!this.isRotating) {
            this.isClockwise = true;
        }
        this.isRotating = !this.isRotating;
        this.sceneUpdateService.toggleRotation();
    }

    public toggleMusic(): void {
        this.sceneUpdateService.gameAudio.toggleMusic();
    }

    public startCelebration(): void {
        this.sceneUpdateService.startCelebration();
    }

    public changeRotation(): void {
        this.isRotating = true;
        this.sceneUpdateService.isRotating = true;
        if (this.isClockwise === CLOCKWISE) {
            this.sceneUpdateService.spinVelocity = 0.5;
            this.isClockwise = !CLOCKWISE;
        }
        else {
            this.sceneUpdateService.spinVelocity = -0.5;
            this.isClockwise = CLOCKWISE;
        }
    }

    public nextTurn(): void {
        this.isEndTurn = false;
        if (!this.isYellowTurn) {
            this.isSetThrow = true;
            this.sceneUpdateService.isSetThrow = true;
        }
        this.putStoneOnIce();
    }

    public startSet(): void {
        this.indexCurrentRedStone = 0;
        this.indexCurrentYellowStone = 0;
        this.isSetThrow = true;
        this.sceneUpdateService.isSetThrow = true;
        this.isEndTurn = false;
        this.isNewSet = false;
        this.sceneUpdateService.resetStones();
        this.putStoneOnIce();
    }

    public startGame(): void {
        this.isSetThrow = true;
        this.sceneUpdateService.isSetThrow = true;
        this.isStartGame = false;
        this.isEndTurn = false;
        this.isNewSet = false;
        this.putStoneOnIce();
    }

    public back(): void {
        this.renderService.removeCanvas();
        this.sceneUpdateService.stopCelebration();
        this.router.navigate(['/difficulty']);
    }

    public endGame(): void {
        this.isEndTurn = true;
        this.isNewSet = true;
        this.isSetThrow = false;
        this.sceneUpdateService.isSetThrow = false;
        this.nSetDone = NSET;
        this.sceneUpdateService.gameAudio.mute();
        this.stopStone();
        this.updateScore();
    }

    public endSet(): void {
        this.isEndTurn = true;
        this.isNewSet = true;
        this.nSetDone++;
        this.isSetThrow = false;
        this.sceneUpdateService.isSetThrow = false;
        this.stopStone();
        this.updateScore();
    }

    private getSpeedLimits(min: boolean): number {
        let from = new THREE.Vector3(0, 0, STONE_ON_SIDE_OFFSET);
        let target = new THREE.Vector3();
        target.z = min ? (ICE_LENGTH - DISTANCE_HOGLINE_END) : (ICE_LENGTH - DISTANCE_HOUSELINE_END);
        return this.physics.getMinSpeedToHit(target, from);
    }
    private animate(): void {
        window.requestAnimationFrame(_ => this.animate());
        this.sceneUpdateService.update();
        this.renderService.render();
    }

    private updateThrowDirection(direction: THREE.Vector3): void {
        this.sceneUpdateService.direction.set(direction.x, 0, direction.z);
    }

    private updateScore(): void {
        if (this.isNewSet) {
            let bool = this.score.updateGame(this.sceneUpdateService.getStonesOnIce());
            if (bool !== null) {
                this.isYellowTurn = bool;
                this.yellowHasHammer = !bool;
            }
        }
    }

    private updateTurn(): void {
        if (this.isYellowTurn) {
            this.indexCurrentYellowStone++;
        }
        else {
            this.indexCurrentRedStone++;
        }
        this.isYellowTurn = !this.isYellowTurn;
        this.isNewSet = this.indexCurrentRedStone === NSTONES && this.indexCurrentYellowStone === NSTONES;
        if (this.isNewSet) {
            this.nSetDone++;
        }
        this.isEndGame = this.nSetDone === NSET;
    }

    private randomizeStarter(): void { //Celui qui commence est determine au hasard
        let max = 1;
        let min = 0;
        let value = Math.floor(Math.random() * (max - min + 1)) + min;
        if (value <= 0.5) {
            this.isYellowTurn = false;
            this.yellowHasHammer = true;
        }
        else {
            this.isYellowTurn = true;
            this.yellowHasHammer = false;
        }
    }

    private stopStone(): void {
        for (let movingStone of this.sceneUpdateService.movingStones) {
            movingStone.speed = 0;
        }
    }

    private enableMoving(): void {
        if (this.minSpeed > this.speed) {
            this.speed = MIN_PROGRESSBAR;
            this.isSetThrow = true;
            this.sceneUpdateService.isSetThrow = true;
        }
        else {
            this.sceneUpdateService.throwingStone();
            this.isSetThrow = false;
            this.sceneUpdateService.isSetThrow = false;
            this.updateTurn();
            this.speed = MIN_PROGRESSBAR;
        }
    }

    private putStoneOnIce(): void {
        this.sceneUpdateService.putStoneOnIce(this.isYellowTurn,
            this.indexCurrentRedStone,
            this.indexCurrentYellowStone);
        this.isNewSet = false;
        this.cursor = "none";
        if (this.isYellowTurn) {
            this.cursor = "default";
            let stoneInHouse = this.score.getStonesInHouse(this.sceneUpdateService.getStonesOnIce());
            let stonesOnIce = this.sceneUpdateService.getStonesOnIce();
            let scoringStones = this.score.getScoringStones(stonesOnIce);
            let botThrow = this.bot.getDirectionVector(stoneInHouse, stonesOnIce, scoringStones);
            this.updateThrowDirection(botThrow);
            this.speed = this.bot.getSpeed();
            this.sceneUpdateService.speed = this.bot.getSpeed();
            this.isRotating = false;
            this.isClockwise = true;
            this.sceneUpdateService.removeRotation();
            this.enableMoving();
        }
    }

    private changeSpeed(): void {
        this.speedIsChanging = true;
        let self = this;
        this.timer = setInterval(function () {
            if (self.speed < self.maxSpeed) {
                self.speed += self.step;
            }
        }, 10);
    }
}
