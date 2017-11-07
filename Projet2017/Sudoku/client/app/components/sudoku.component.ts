import { Component, ElementRef } from '@angular/core';
import { AppService } from '../services/app.service';
import { VerificatorService } from '../services/sudokuVerificator.service';
import { Timer } from '../classes/timer';
import { User } from '../classes/user';
import * as io from 'socket.io-client';
import { Router } from '@angular/router';


const SIDE_SUDOKU = 9;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;


@Component({
  selector: 'sudoku-component',
  templateUrl: '/assets/templates/sudoku.component.html',
  styleUrls: ['assets/stylesheets/sudoku.component.css',
              'assets/stylesheets/buttons.css',
              'assets/stylesheets/info.css',
              'assets/stylesheets/rightPanel.css'],
  providers: [AppService, VerificatorService]
})
export class SudokuComponent {
  difficulties = ['Facile', 'Difficile'];
  desiredDifficulty: string;
  help = false;

  originalSudoku: number[][] = [];
  modifiedSudoku: any[][] = [];
  solution: number[][];
  isCompleted: boolean;
  isWaiting = false;

  timer: Timer = new Timer();
  showTime = true;
  infoBoard: any[] = [];
  socket: SocketIOClient.Socket;

  leaderBoardEasy: any[] = [];
  leaderBoardHard: any[] = [];
  isFastestTime = false;
  leaderboardsReceived = false;


  constructor(private service: AppService, private router: Router, private verificator: VerificatorService, private element: ElementRef) {
    if (!User.username) {
      this.router.navigate(['/login']);
    }
    else {
      this.initSocket();
    }
  }

  initSocket() {
    this.socket = User.socket;
    //can't use this inside on() method
    let self = this;
    //push the event in array on reception
    this.socket.on('event', function (data: any) {
      if (self.infoBoard.length === 100) {
        self.infoBoard.splice(0, 1);
      }
      self.infoBoard.push({ date: data.date, type: data.type, description: data.desc });
      self.updateScroll();
    });

    this.socket.on('sudoku_sent', function (sudoku: any) {
      self.saveSudoku(sudoku);
      self.isWaiting = false;
    });

    this.socket.on('leaderboards_sent', function (data: any) {
      self.leaderBoardEasy = data.lbEasy;
      self.leaderBoardHard = data.lbHard;
      self.leaderboardsReceived = true;
    });

    this.socket.on('fastest_time', function () {
      self.isFastestTime = true;
    })

  }

  //Initialise modifiedSudoku et y place les valeurs de départ
  merge() {
    for (let i = 0; i < SIDE_SUDOKU; i++) {
      this.modifiedSudoku[i] = [];
    }
    for (let i = 0; i < SIDE_SUDOKU; i++) {
      for (let j = 0; j < SIDE_SUDOKU; j++) {
        this.modifiedSudoku[i].push({
          num: this.originalSudoku[i][j],
          isValid: true
        });
      }
    }
  }

  deepCopy(originalArray: number[][]): number[][] {
    let copy: number[][] = [];
    for (let i = 0; i < originalArray.length; i++) {
      copy[i] = [];
    }
    for (let i = 0; i < originalArray.length; i++) {
      for (let j = 0; j < originalArray.length; j++) {
        copy[i][j] = originalArray[i][j];
      }
    }
    return copy;
  }

  //Demande un nouveau sudoku et le save
  getSudoku() {
    this.isWaiting = true;
    this.leaderboardsReceived = false;
    this.isFastestTime = false;
    User.difficulty = this.desiredDifficulty.toLowerCase();
    this.timer.stopTimer();
    this.socket.emit('sudoku_request', User.difficulty);
  }

  //Sauvegarde le sudoku provenant du serveur
  saveSudoku(sudoku: any) {
    this.originalSudoku = sudoku.empty;
    this.solution = sudoku.solution;
    this.merge();
    this.timer.startTimer();
  }

  onKey(e: any, i: number, j: number) {

    if (!this.isCompleted) {
      if ((49 <= e.keyCode && e.keyCode <= 57) || ((97 <= e.keyCode && e.keyCode <= 107))) { //Entre 0 et 9
        //place le numero dans la case, remplace le numero precedent
        e.target.value = String.fromCharCode((96 <= e.keyCode && e.keyCode <= 105) ? e.keyCode - 48 : e.keyCode);

        let valeur = parseInt(e.target.value, 10);
        this.modifiedSudoku[i][j].num = valeur;
        this.update();
      }

      else if (e.keyCode === 8 || e.keyCode === 46) { //Backspace ou delete
        e.target.value = "";
        this.modifiedSudoku[i][j].num = 0;
        this.modifiedSudoku[i][j].isValid = true;
        this.update();
      }
    }

    if (e.keyCode <= 40 && e.keyCode >= 37) { // arrow keys
      this.move(e, i, j);
    }

    else {
      e.preventDefault();
    }

  }

  //Bouge le focus des cases du sudoku
  move(e: any, i: number, j: number) {
    e.preventDefault();
    if (e.keyCode === KEY_UP) {
      let id = '#cell';

      id += String(this.decrement(i));
      id += String(j);
      this.element.nativeElement.querySelector(id).focus();
    }
    else if (e.keyCode === KEY_DOWN) {
      let id = '#cell';

      id += String(this.increment(i));
      id += String(j);
      this.element.nativeElement.querySelector(id).focus();
    }
    else if (e.keyCode === KEY_LEFT) {
      let id = '#cell';

      id += String(i);
      id += String(this.decrement(j));
      this.element.nativeElement.querySelector(id).focus();
    }

    else if (e.keyCode === KEY_RIGHT) {
      let id = '#cell';

      id += String(i);
      id += String(this.increment(j));
      this.element.nativeElement.querySelector(id).focus();
    }
  }

  decrement(n: number): number {
    if (--n < 0) {
      n = 8;
    }
    return n;
  }

  increment(n: number): number {
    if (++n > 8) {
      n = 0;
    }
    return n;
  }

  //Update la validité de chaque case modifiée du sudoku
  update() {
    this.isCompleted = true;
    for (let i = 0; i < SIDE_SUDOKU; i++) {
      for (let j = 0; j < SIDE_SUDOKU; j++) {

        //Pour chaque case modifiée, on vérifie et met à jour la validité
        if (this.originalSudoku[i][j] === 0 && this.modifiedSudoku[i][j].num !== 0) {
          let value: number = this.modifiedSudoku[i][j].num;
          this.modifiedSudoku[i][j].num = 0;
          if (!this.verificator.isValidCell(i, j, value, this.modifiedSudoku)) {
            this.modifiedSudoku[i][j].isValid = false;
            this.isCompleted = false; //Une case non valide signifie que le sudoku est incomplet
          }
          else {
            this.modifiedSudoku[i][j].isValid = true;
          }
          this.modifiedSudoku[i][j].num = value;
        }
        //Une case encore à 0 signifie que le sudoku est incomplet
        else if (this.originalSudoku[i][j] === 0 && this.modifiedSudoku[i][j].num === 0) {
          this.isCompleted = false;
        }
      }
    }
    if (this.isCompleted) {
      this.timer.stopTimer();
      this.sendScore();
      console.log("Sudoku Completed");
    }
  }

  sendScore() {
    let sec = this.timer.tick;
    let time = this.timer.timeToString(sec);
    let score = { name: User.username, difficulty: User.difficulty, sec: sec, time: time };
    console.log("Sending new score to server:", score);
    this.socket.emit("new_score", score);
  }

  updateScroll() {
    let el = this.element.nativeElement.querySelector(".log");
    el.scrollTop = el.scrollHeight;
  }


  reset() {
    this.merge();
    this.timer.stopTimer();
    this.timer.startTimer();
    this.isCompleted = false;
  }
}
