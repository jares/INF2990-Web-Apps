import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { Page } from '../classes/page';
import * as io from 'socket.io-client';

const SERVER_URL = 'http://localhost:3002';


@Component({
  selector: 'app-user',
  templateUrl: '/assets/templates/user.component.html',
  styleUrls: ['assets/stylesheets/user.component.css'],
  providers: [AppService]
})
export class UserComponent {
  socket: SocketIOClient.Socket;
  username: string;
  gameSize: number;
  userAdded = "";
  players = [2, 3, 4];

  constructor(private dataService: AppService, private router: Router) {
    //si l'utilisateur a deja son username sur cette page, cela signifie qu'il a quitté la page d'attente
    //on le delete donc de
    if (User.username) {
      User.socket.disconnect();
      User.delete();
    }
    User.page = Page.Login;
  }

  addUser() {
    this.dataService.addUser(this.username).subscribe(
      data => {
        this.saveAddedUser(data);  //Le paramatre data contient la value (true ou false) retourner par le serveur
        this.isAdded();
      }
    );
  }

  saveAddedUser(value: string) {     //Sauvegarder la value (true ou false) retourne par le serveur
    this.userAdded = value;
  }

  isAdded() {
    if (this.userAdded === 'false') {
      alert("Le nom d'utilisateur est pris, veuillez choisir un autre");
    }
    else {
      this.socket = io.connect(SERVER_URL);

      User.username = this.username;
      User.gameSize = this.gameSize;
      User.socket = this.socket;
      this.socket.emit('new_player', User.username);
      this.socket.emit('find_game', User.gameSize);
      this.router.navigate(['/waitingRoom']);
    }

  }
}
