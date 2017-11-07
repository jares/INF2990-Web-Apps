export class GameAudio {
    private static instance: GameAudio;
    private waitingMusic: any;

    static getInstance(): any {
        if (!GameAudio.instance) {
            GameAudio.instance = new GameAudio();
        }
        return GameAudio.instance;
    }

    public constructor() {
        this.waitingMusic = new Audio('../../assets/sound/ElevatorOST.mp3');
    }

    public playMusic(): void {
        this.waitingMusic.volume = 1;
        this.waitingMusic.play();
    }

    public stopMusic(): void {
        this.waitingMusic.pause();
        this.waitingMusic.currentTime = 0;
    }
}
