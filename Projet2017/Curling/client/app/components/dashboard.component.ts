import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { UserCurling } from '../classes/userCurling';
import { DataService } from '../services/data.service';

const NSET = 3;
const MIN_PROGRESSBAR = 1.3;
const NSTONES = 8;

@Component({
    selector: 'my-dashboard',
    templateUrl: "assets/templates/dashboard-component-template.html",
    styleUrls: ['assets/stylesheets/dashboard.component.css']
})

export class DashboardComponent implements OnChanges {

    private isFirstSet: boolean;
    private isSecondSet: boolean;
    private isThirdSet: boolean;
    private isEndGame: boolean;
    private isCelebrating: boolean;
    private isAskingForHelp: boolean;
    private isPlayingMusic: boolean;

    private username: string;
    private AI: string;
    private percent: string;

    private scoreUser: number;
    private scoreAI: number;
    private velocityPercent: number;

    private leaderBoardNormal: any[];
    private leaderBoardHard: any[];
    private spritesPlayer: any[];
    private spritesAI: any[];

    @Input() isNewSet: boolean;
    @Input() nStonesLeftPlayer: number;
    @Input() nStonesLeftAI: number;
    @Input() velocity: number;
    @Input() maxVelocity: number;
    @Input() isEndTurn: boolean;
    @Input() nSetPlayed: number;
    @Input() isSetThrow: boolean;
    @Input() isRotating: boolean;
    @Input() isClockwise: boolean;
    @Input() yellowHasHammer: boolean;

    @Output() beginGame = new EventEmitter;
    @Output() continueGame = new EventEmitter();
    @Output() restartGame = new EventEmitter();
    @Output() celebration = new EventEmitter();
    @Output() endOfTurn = new EventEmitter();
    @Output() changeDifficulty = new EventEmitter();
    @Output() changeRotation = new EventEmitter();
    @Output() toggleRotation = new EventEmitter();
    @Output() playMusic = new EventEmitter();

    constructor(private dataService: DataService) {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges): void {

        this.updateProgressBar();
        if (changes['nStonesLeftPlayer'] !== undefined) {
            if (changes['nStonesLeftPlayer'].currentValue > changes['nStonesLeftPlayer'].previousValue) {
                this.spritesPlayer.pop();
            }
        }
        else if (changes['nStonesLeftAI'] !== undefined) {
            if (changes['nStonesLeftAI'].currentValue > changes['nStonesLeftAI'].previousValue) {
                this.spritesAI.pop();
            }
        }
        else if (this.isNewSet) {
            this.updateScore();
            this.updateSet();

            if (this.nSetPlayed === NSET) {
                this.isPlayingMusic = false;
                this.playMusic.emit(false);
                if (UserCurling.score > UserCurling.computerScore) {
                    let self = this;
                    this.isCelebrating = true;
                    this.celebration.emit();
                    this.playMusic.emit(false);
                    setTimeout(function () {
                        self.isEndGame = true;
                        self.updateScoreLeaderBoard();
                    }, 5000);
                }
                else {
                    this.isEndGame = true;
                    this.updateScoreLeaderBoard();
                }
            }
            else {
                while (this.spritesPlayer.length < NSTONES) {
                    this.spritesPlayer.push(0);
                }
                while (this.spritesAI.length < NSTONES) {
                    this.spritesAI.push(0);
                }
            }
        }
        else {
            this.isEndGame = false;
        }
    }

    public restart(): void {
        this.isPlayingMusic = true;
        this.playMusic.emit(true);
        this.restartGame.emit();
    }

    public continue(): void {
        this.continueGame.emit();
    }

    public toggleHelp(): void {
        this.isAskingForHelp = !this.isAskingForHelp;
    }

    public toggleMusic(): void {
        if (this.isPlayingMusic) {
            this.isPlayingMusic = false;
            this.playMusic.emit(false);
        }
        else {
            this.isPlayingMusic = true;
            this.playMusic.emit(true);
        }
    }

    public endTurn(): void {
        this.endOfTurn.emit();
    }

    public startGame(): void {
        this.beginGame.emit();
    }

    public newDifficulty(): void {
        this.changeDifficulty.emit();
    }

    public emitToggleRotation(): void {
        this.toggleRotation.emit();
    }

    public emitChangeRot(): void {
        this.changeRotation.emit();
    }

    private init(): void {
        this.isFirstSet = true;
        this.isSecondSet = false;
        this.isThirdSet = false;
        this.username = UserCurling.username;
        this.isEndGame = false;
        this.isCelebrating = false;
        this.isAskingForHelp = false;
        this.isPlayingMusic = true;
        this.AI = UserCurling.normalAI ? "CPU Normal" : "CPU Difficile";
        this.scoreUser = 0;
        this.scoreAI = 0;
        UserCurling.score = 0;
        UserCurling.computerScore = 0;

        this.leaderBoardNormal = [];
        this.leaderBoardHard = [];
        this.spritesPlayer = [];
        this.spritesAI = [];
        for (let i = 0; i < NSTONES; i++) {
            this.spritesPlayer.push(0);
            this.spritesAI.push(0);
        }
        this.velocityPercent = 0;
    }

    private updateSet(): void {
        let currentSet = this.nSetPlayed + 1;
        switch (currentSet) {
            case 1:
                this.isFirstSet = true;
                this.isSecondSet = false;
                this.isThirdSet = false;
                break;
            case 2:
                this.isFirstSet = true;
                this.isSecondSet = true;
                this.isThirdSet = false;
                break;
            default: // case 3+
                this.isFirstSet = true;
                this.isSecondSet = true;
                this.isThirdSet = true;
                break;
        }
    }

    private updateScore(): void {
        this.scoreUser = UserCurling.score;
        this.scoreAI = UserCurling.computerScore;
    }

    private updateProgressBar(): void {
        this.velocityPercent = ((this.velocity - MIN_PROGRESSBAR) / (this.maxVelocity - MIN_PROGRESSBAR)) * 100;
        this.percent = this.velocityPercent.toString() + "%";
    }

    private saveLeaderBoard(data: any): void {
        this.leaderBoardNormal = data.lbNormal;
        while (this.leaderBoardNormal.length < 3) {
            this.leaderBoardNormal.push({
                name: "KevinCena", normalAI: true,
                userScore: 0, AIscore: 0
            }); //Nom fictif
        }
        this.leaderBoardHard = data.lbHard;
        while (this.leaderBoardHard.length < 3) {
            this.leaderBoardHard.push({
                name: "JohnOwens", normalAI: false,
                userScore: 0, AIscore: 0
            }); //Nom fictif
        }
    }

    private updateScoreLeaderBoard(): void {
        let score = {
            name: UserCurling.username, normalAI: UserCurling.normalAI,
            userScore: UserCurling.score, AIscore: UserCurling.computerScore
        };
        if (UserCurling.score > UserCurling.computerScore) {
            this.dataService.addScore(score).subscribe((data) => this.saveLeaderBoard(data));
        }
        else {
            this.dataService.getScore().subscribe((data) => this.saveLeaderBoard(data));
        }
    }
}
