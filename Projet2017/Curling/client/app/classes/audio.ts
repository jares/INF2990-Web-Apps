const MAX_SPEED = 4;
const MAX_COLLISION = 3;
const MUSIC_NUMBER_TOTAL = 8;

export class GameAudio {
    private static instance: GameAudio;
    private soundCollision: any;
    private soundMovement: any;
    private soundCelebration: any;
    private soundBroom: any;
    private orgueSounds: any[];
    private orgueSounds2: any[];
    private orgueIndex: number;
    private orgueIndex2: number;
    private isPlayingMusic: boolean;

    static getInstance(): GameAudio {
        if (!GameAudio.instance) {
            GameAudio.instance = new GameAudio();
        }
        return GameAudio.instance;
    }

    private constructor() {
        this.orgueSounds = [];
        this.orgueSounds2 = [];
        this.orgueIndex = 0;
        this.orgueIndex2 = 0;
        this.soundCollision = new Audio('../../assets/sound/CurlingRockHit.mp3');
        this.soundMovement = new Audio('../../assets/sound/NewCurlingGlideLong.mp3');
        this.soundCelebration = new Audio('../../assets/sound/Celebration.mp3');
        this.soundBroom = new Audio('../../assets/sound/broom_sweep.mp3');
        this.initOrganSound(this.orgueSounds);
        this.initOrganSound(this.orgueSounds2);
        this.isPlayingMusic = true;
    }

    public verifyIndex(): void {
        if (this.orgueIndex === MUSIC_NUMBER_TOTAL) {
            this.orgueIndex = 0;
        }

        if (this.orgueIndex2 === MUSIC_NUMBER_TOTAL) {
            this.orgueIndex2 = 0;
        }
    }
    public initOrganSound(orgueSounds: any[]): void {
        let saveNumber = [];
        let path = '../../assets/sound/Organ';
        let path1 = '.mp3';
        while (orgueSounds.length < MUSIC_NUMBER_TOTAL) {
            let songNumber = Math.ceil(Math.random() * MUSIC_NUMBER_TOTAL);
            if (saveNumber.indexOf(songNumber) === -1) {
                saveNumber.push(songNumber);
                let fullPath = path + songNumber.toString() + path1;
                let orgue = new Audio(fullPath);
                orgueSounds.push(orgue);
            }
        }
    }

    public toggleMusic(): void {
        this.isPlayingMusic = !this.isPlayingMusic;
        this.isPlayingMusic ? this.unmute() : this.mute();
    }

    public playOrgue(isYellow: boolean): void {
        this.verifyIndex();
        if (isYellow) {
            this.orgueSounds2[this.orgueIndex2++].play();
        }
        else {
            this.orgueSounds[this.orgueIndex++].play();
        }
    }

    public stopOrgue(isYellow: boolean): void {
        if (isYellow) {
            if (this.orgueIndex !== 0) {
                this.orgueSounds[this.orgueIndex - 1].pause();
            }
        }
        else {
            if (this.orgueIndex2 !== 0) {
                this.orgueSounds2[this.orgueIndex2 - 1].pause();
            }
        }
    }

    public mute(): void {
        for (let i = 0; i < MUSIC_NUMBER_TOTAL; i++) {
            this.orgueSounds[i].volume = 0;
            this.orgueSounds2[i].volume = 0;
        }
        this.soundCelebration.volume = 0;
    }

    public unmute(): void {
        for (let i = 0; i < MUSIC_NUMBER_TOTAL; i++) {
            this.orgueSounds[i].volume = 1;
            this.orgueSounds2[i].volume = 1;
        }
        this.soundCelebration.volume = 1;
    }

    public playCollision(speed: any): void {
        let soundCollision = this.soundCollision.cloneNode(true);
        let volume = speed / MAX_COLLISION;
        soundCollision.volume = volume;
        soundCollision.play();
    }

    public playGlide(speed: number): void {
        let volume = speed / MAX_SPEED;
        this.soundMovement.volume = volume;
        this.soundMovement.play();
    }

    public playCelebration(): void {
        if (this.orgueSounds[this.orgueIndex - 1] !== undefined) {
            this.orgueSounds[this.orgueIndex - 1].pause();
        }
        if (this.orgueSounds2[this.orgueIndex2 - 1] !== undefined) {
            this.orgueSounds2[this.orgueIndex2 - 1].pause();
        }
        this.soundCelebration.volume = 1;
        this.soundCelebration.play();
    }

    public playBroom(): void {
        this.soundBroom.play();
    }

    public stopBroom(): void {
        this.soundBroom.pause();
        this.soundBroom.currentTime = 0;
    }
    public stopCelebration(): void {
        this.soundCelebration.pause();
        this.soundCelebration.volume = 0;
    }

    public stopGlide(): void {
        this.soundMovement.pause();
        this.soundMovement.currentTime = 0;
        this.soundMovement.volume = 1;
    }

    public decreaseGlide(speed: any): void {
        let volume = speed / MAX_SPEED;
        this.soundMovement.volume = volume;
    }
}
