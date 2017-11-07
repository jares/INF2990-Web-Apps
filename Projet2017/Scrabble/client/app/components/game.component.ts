import { Component, ElementRef, HostListener } from '@angular/core';
import { Tile } from '../classes/tile';
import { User } from '../classes/user';
import { Router } from '@angular/router';
import { Timer } from '../classes/timer';
import { Page } from '../classes/page';

const LEFT = 37;
const RIGHT = 39;

// onst star = ['77'];
// const word3x = ['00', '07', '70', '014', '140', '1414', '147', '714'];


const star = ['H8'];
const word3x = ['A1', 'H1', 'O1', 'A8', 'O8', 'A15', 'H15', 'O15'];
const word2x = ['B2', 'C3', 'D4', 'E5', 'K5', 'L4', 'M3', 'N2', 'B14',
    'C13', 'D12', 'E11', 'K11', 'L12', 'M13', 'N14'];
const letter2x = ['D1', 'L1', 'G3', 'I3', 'A4', 'H4', 'O4', 'C7', 'G7', 'I7', 'M7', 'D8',
    'L8', 'C9', 'G9', 'I9', 'M9', 'A12', 'H12', 'O12', 'G13', 'I13', 'D15', 'L15'];
const letter3x = ['F2', 'J2', 'B6', 'F6', 'J6', 'N6', 'B10', 'F10', 'J10', 'N10', 'F14', 'J14'];
const AXE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];


@Component({
    selector: 'my-game',
    templateUrl: '/assets/templates/game.component.html',
    styleUrls: ['assets/stylesheets/game.component.css',
        'assets/stylesheets/tile.css',
        'assets/stylesheets/chat.css',
        'assets/stylesheets/infoPanel.css',
        'assets/stylesheets/letterRack.css',
        'assets/stylesheets/board.css']
})
export class GameComponent {

    //Scrabble board
    board: any[][];
    indexes: any[];

    //timer
    timer: Timer = new Timer();

    //User
    username = User.username;
    score = 0;

    //Letter Rack
    rack: any[] = [];
    selectedLetter = "";
    selectedIndex = -1;

    //Reserve
    numLettersLeft: number;

    //Chat
    userMsg = "";
    log: any[] = [];

    //Socket.io
    socket = User.socket;

    //Fin de partie
    gameOver = false;
    winner = "";
    winnerScore = 0;

    constructor(private element: ElementRef, private router: Router) {

        if (!this.username || User.page !== Page.WaitingRoom) {
            this.router.navigate(['/login']);
        }
        else {
            User.page = Page.Game;
            this.board = [];
            for (let i = 0; i < 15; i++) {
                this.board[i] = [];
                for (let j = 0; j < 15; j++) {
                    this.board[i].push({ tile: null, class: this.getClassFromCoordinates(i, j) });
                }
            }

            this.indexes = [];
            for (let k = 0; k < 15; k++) {
                this.indexes.push({ letter: String.fromCharCode(65 + k), num: k + 1 });
            }

            this.initSocket();
        }
    }

    initSocket() {
        let self = this;

        this.socket.on('command', function (data: string) {
            self.log.push({ data: data, class: 'command' });
            self.updateScroll();
        });

        this.socket.on('help', function (data: string[]) {
            for (let i = 0; i < data.length; i++) {
                self.log.push({ data: data[i], class: 'command' });
                self.updateScroll();
            }
        });

        this.socket.on('chat_message', function (data: any) {
            self.log.push({ data: data, class: null });
            self.updateScroll();
        });

        this.socket.on('new_letters_in_rack', function (letters: string) {
            let hasBlankTile = false;
            for (let i = 0; i < letters.length; i++) {
                console.log(letters[i]);
                self.rack.push({ tile: new Tile(letters[i]), focus: false });
                if (letters[i] === "*") {
                    hasBlankTile = true;
                }
            }
            if (hasBlankTile) {
                self.log.push({
                    data: `Pour échanger une tuile vide dans la commande !changer, 
                    vous n'avez qu'à utiliser le caractère *`, class: "command"
                });
            }
        });

        this.socket.on('remove_letter_from_rack', function (letter: string) {
            let index = self.firstIndexOf(letter);
            self.rack.splice(index, 1);
        });

        this.socket.on('new_turn', function (username: string) {
            if (username === self.username) {
                self.log.push({ data: "C'est votre tour!", class: 'command' });
                self.updateScroll();
                self.timer.startTimer();
            }
            else {
                self.log.push({ data: "C'est le tour de " + username, class: 'command' });
                self.updateScroll();
                if (self.timer.isActive) {
                    self.timer.stopTimer();
                }
            }
        });

        this.socket.on('end_turn', function () {
            if (self.timer.isActive) {
                self.timer.stopTimer();
            }
        });

        this.socket.on('add_board_tile', function (data: any) {
            self.board[data.i][data.j].tile = data.tile;
        });

        this.socket.on('remove_board_tile', function (data: any) {
            self.board[data.i][data.j].tile = null;
        });

        this.socket.on('update_score', function (newScore: number) {
            self.score = newScore;
        });

        this.socket.on('update_qty_reserve', function (qty: number) {
            self.numLettersLeft = qty;
        });

        this.socket.on('end_game', function (winner: any) {
            self.gameOver = true;
            if (self.timer.isActive) {
                self.timer.stopTimer();
            }
            self.winner = winner.name;
            self.winnerScore = winner.score;
        });
    }

    returnToLogin() {
        this.router.navigate(['/login']);
    }

    updateScroll() {
        let el = this.element.nativeElement.querySelector("#chat-log");
        el.scrollTop = el.scrollHeight;
    }

    getClassFromCoordinates(i: number, j: number): string {
        let coordinates = AXE[i] + (j + 1).toString();
        if (star.indexOf(coordinates) > -1) {
            return "star";
        }
        else if (word3x.indexOf(coordinates) > -1) {
            return "word-3x";
        }
        else if (word2x.indexOf(coordinates) > -1) {
            return "word-2x";
        }
        else if (letter2x.indexOf(coordinates) > -1) {
            return "letter-2x";
        }
        else if (letter3x.indexOf(coordinates) > -1) {
            return "letter-3x";
        }
        return null;
    }

    eventHandler(e: any) {
        if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode <= 122 || e.keyCode === 42) {
            let l = String.fromCharCode(e.keyCode).toUpperCase();
            this.select(l);
        }
    }

    move(e: any) {
        if (e.keyCode === LEFT || e.keyCode === RIGHT) {
            this.swap(this.selectedIndex, e.keyCode === RIGHT);
        }
    }


    changeFocus(toChat: boolean) {
        let el;
        if (toChat) {
            this.unfocus();
            el = this.element.nativeElement.querySelector("#msg-input");
        }
        else {
            el = this.element.nativeElement.querySelector("#letter-rack-container");
        }
        el.focus();
    }

    submit() {
        let msg = this.userMsg;
        this.userMsg = "";

        console.log('Submitting message', msg);
        this.socket.emit('user_input', msg);
    }

    select(l: string) {
        if (this.selectedLetter !== l) {
            let index = this.firstIndexOf(l);
            if (index > -1) {
                console.log('Selected letter', l, 'at index', index);
                this.focus(index);
            }
            else {
                console.log('Letter', l, 'not in rack');
                this.unfocus();
            }
        }
        else {
            console.log('Selecting next', l, 'in rack');
            let index = this.nextIndexOf(l, this.selectedIndex);
            this.focus(index);
        }
    }

    firstIndexOf(l: string): number {
        for (let i = 0; i < this.rack.length; i++) {
            if (this.rack[i].tile.letter === l) {
                return i;
            }
        }
        return -1;
    }

    nextIndexOf(l: string, pos: number): number {
        let i = 1;

        while (i <= this.rack.length) {
            let index = (pos + i) % this.rack.length;
            if (this.rack[index].tile.letter === l) {
                return index;
            }
            i++;
        }
        return -1;
    }

    unfocus() {
        if (this.selectedIndex > -1) {
            this.rack[this.selectedIndex].focus = false;
        }
    }

    focus(index: number) {
        this.unfocus();
        this.rack[index].focus = true;
        this.selectedLetter = this.rack[index].tile.letter;
        this.selectedIndex = index;
    }

    swap(i: number, right: boolean) {

        if (this.selectedIndex === -1) {
            return;
        }

        let j;
        let temp;

        if (right) {
            j = this.increment(i);
        }
        else {
            j = this.decrement(i);
        }

        this.selectedIndex = j;

        temp = this.rack[i];
        this.rack[i] = this.rack[j];
        this.rack[j] = temp;
    }

    increment(i: number): number {
        if (++i === this.rack.length) {
            return 0;
        }
        return i;
    }

    decrement(i: number): number {
        if (--i === -1) {
            return this.rack.length - 1;
        }
        return i;
    }
    @HostListener('document:keyup', ['$event'])
    onKey(event: any): void {
        if (event.keyCode === 27) {
            if (this.gameOver) {
                this.returnToLogin();
            }
        }
    }
}
