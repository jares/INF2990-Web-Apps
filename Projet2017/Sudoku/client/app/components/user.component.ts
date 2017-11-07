import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { AppService } from '../services/app.service';
import * as io from 'socket.io-client';

const SERVEUR_URL = 'http://localhost:3002';


@Component({
    //moduleId: module.id,
    selector: 'my-user',
    templateUrl: 'assets/templates/user.component.html',
    styleUrls: ['assets/stylesheets/user.component.css']
})
export class UserComponent {

    username: string;
    socket: SocketIOClient.Socket;

    constructor(private appService: AppService, private router: Router) {
        if(User.username) {
            User.delete();
        }
    }


    save(): void {
        console.log("save()", this.username);
        this.appService.addUser(this.username).subscribe(
            data => {
                if (data === true) {
                    console.log(this.username, "is free");
                    // alerte pour confirmer le choix de la difficulte et le nom d'utilisateur
                    // alert(this.utilisateur.username + ", " + this.utilisateur.difficulteFacile);
                    this.socket = io.connect('http://localhost:3002');
                    User.socket = this.socket;
                    User.username = this.username;
                    User.socket.emit("new_player", User.username);
                    this.router.navigate(['/sudoku']);
                }
                else {
                    console.log(this.username, "is taken");
                    alert("Le nom est déjà pris, veuillez choisir un autre.");
                }
            }
        );
    }
}
