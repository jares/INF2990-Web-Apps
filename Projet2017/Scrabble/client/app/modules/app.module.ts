import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../components/app.component';
import { UserComponent } from '../components/user.component';
import { GameComponent } from '../components/game.component';
import { WaitingRoomComponent } from '../components/waitingRoom.component';
import { AppRoutingModule } from './app.routing.module';
@NgModule({
  imports: [ BrowserModule, HttpModule, JsonpModule, FormsModule, AppRoutingModule],
  declarations: [ AppComponent, UserComponent, GameComponent, WaitingRoomComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
