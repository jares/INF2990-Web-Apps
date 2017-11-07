import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { Page } from '../classes/page';
import { GameAudio } from '../classes/gameAudio';

@Component({
  selector: 'waiting-room',
  templateUrl: '/assets/templates/waitingRoom.component.html',
  styleUrls: ['assets/stylesheets/waitingRoom.component.css'],
})

export class WaitingRoomComponent {

  username = User.username;
  socket = User.socket;
  gameSize = User.gameSize;
  num: number;
  gameAudio: GameAudio;
  isPlaying = true;

  constructor(private router: Router) {
    if (!this.username || User.page !== Page.Login) {
      this.router.navigate(['/login']);
    }
    else {
      this.playMusic();
      User.page = Page.WaitingRoom;
      let self = this;
      this.socket.on('start_game', function () {
        self.gameAudio.stopMusic();
        self.router.navigate(['/scrabble']);
      });
      this.numPlayersLeft();
    }
  }

  public disconnect(): void {
    this.stopMusic();
    this.router.navigate(['/login']);
  }

  public numPlayersLeft(): void {
    let self = this;
    this.socket.on('numPlayersLeft', function (data: any) {
      self.num = data;
    });
  }

  @HostListener('document:keyup', ['$event'])
  onKey(event: any): void {
    if (event.keyCode === 27) {
      this.disconnect();
    }
  }

  public stopMusic(): void {
    this.isPlaying = false;
    this.gameAudio.stopMusic();
  }

  public playMusic(): void {
    this.isPlaying = true;
    this.gameAudio = GameAudio.getInstance();
    this.gameAudio.playMusic();
  }
}
