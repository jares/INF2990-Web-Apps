import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserCurling } from '../classes/userCurling';
import { DataService } from '../services/data.service';
import * as io from 'socket.io-client';
const SERVER_URL = 'http://localhost:3002';

@Component({
  selector: 'app-user',
  templateUrl: 'assets/templates/user-component-template.html',
  styleUrls: ['assets/stylesheets/user.component.css'],
  providers: [DataService]
})
export class UserComponent {

  @Output() userValid = new EventEmitter();
  @Output() userOutput = new EventEmitter();
  private username = "";
  private socket: SocketIOClient.Socket;

  constructor(private dataService: DataService, private router: Router) {
    console.log("user.component");
    if (UserCurling.page !== 0) {
      console.log("user.component, deleting user info");
      UserCurling.delete();
    }
  }

  public addUser(): void {
    this.dataService.addUser(this.username).subscribe(
      data => {
        if (data) {
          this.userOutput.emit(this.username);
          UserCurling.username = this.username;
          this.socket = io.connect(SERVER_URL);

          this.socket.emit('new_player', this.username);
          UserCurling.page = 1;
          this.router.navigate(['/difficulty']);
        }
        else {
          alert("Le nom d'utilisateur est pris, veuillez en choisir un autre.");
        }
      }
    );
  }
}
