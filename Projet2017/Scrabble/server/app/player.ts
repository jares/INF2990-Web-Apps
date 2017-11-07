import * as SocketIO from 'socket.io';

export class Player {

    private username: string;
    private socket: SocketIO.Socket;
    private score: number;
    private preBonusScore: number;
    private rack: string[] = [];    //chevalet du joueur, contient les lettres, pas les tuiles vides (*)
    private blankTiles: number;     //nombre de tuiles vides que le joueur possède
    private active: boolean;

    constructor(username: string, socket: SocketIO.Socket) {
        this.username = username;
        this.socket = socket;
        this.score = 0;
        this.blankTiles = 0;
    }

    getUsername(): string {
        return this.username;
    }

    getSocket(): SocketIO.Socket {
        return this.socket;
    }

    getBlankTiles(): number {
        return this.blankTiles;
    }

    setBlankTiles(qty: number) {
        this.blankTiles = qty;
    }

    getRackLength(): number {
        return this.rack.length;
    }

    getScore(): number {
        return this.score;
    }

    setScore(newScore: number) {
        this.score = newScore;
    }

    getPreBonusScore(): number {
        return this.preBonusScore;
    }

    setPreBonusScore(newScore: number) {
        this.preBonusScore = newScore;
    }

    isActive(): boolean {
        return this.active;
    }

    emit(type: string, msg: any) {
        this.socket.emit(type, msg);
    }

    removeLetter(letter: string): boolean {
        if (letter === "*") {
            this.socket.emit('remove_letter_from_rack', "*");
            return true;
        }
        for (let i = 0; i < this.rack.length; i++) {
            if (this.rack[i] === letter) {
                this.socket.emit('remove_letter_from_rack', this.rack[i]);
                this.rack.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    removeLetters(letters: string) {
        for (let i = 0; i < letters.length; i++) {
            this.removeLetter(letters[i]);
        }
        console.log("the player has", this.blankTiles, "blank tiles");
    }

    addLetters(letters: string) {
        for (let i = 0; i < letters.length; i++) {
            if (letters[i] === "*") {
                this.blankTiles++;
            }
            else {
                this.rack.push(letters[i]);
            }
        }
        this.socket.emit('new_letters_in_rack', letters);
    }

    deleteRack() {
        this.rack = [];
    }

    startTurn() {
        this.active = true;
    }

    endTurn() {
        this.active = false;
        this.socket.emit('end_turn');
    }

    addScore(newScore: number) {
        this.score += newScore;
        this.socket.emit("update_score", this.score);
    }

    copyRack(): string[] {
        let rackCopy: string[] = [];
        for (let i = 0; i < this.rack.length; i++) {
            rackCopy.push(this.rack[i]);
        }
        return rackCopy;
    }

    hasLetters(word: string): boolean {
        let numMissingLetters = 0;
        let rackCopy: string[] = [];
        for (let i = 0; i < this.rack.length; i++) {
            rackCopy.push(this.rack[i]);
        }

        let index: number;
        for (let j = 0; j < word.length; j++) {
            index = rackCopy.indexOf(word[j].toUpperCase());
            if (index > -1) {
                //Le joueur a la lettre
                rackCopy.splice(index, 1);
            }
            else {
                //le joueur n'a pas la lettre, mais on prend en compte les tuiles vides
                if (++numMissingLetters > this.blankTiles) {
                    //le joueur n'a pas assez de tuiles vides
                    return false;
                }
            }
        }
        return true;
    }

    printRack() {
        let rack = "";
        for (let i = 0; i < this.rack.length; i++) {
            rack += this.rack[i];
        }
        console.log(rack);
    }
}
