import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from '../components/game.component';
import { UserComponent } from '../components/user.component';
import { WaitingRoomComponent } from '../components/waitingRoom.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'scrabble', component: GameComponent},
  { path: 'login', component: UserComponent},
  { path: 'waitingRoom', component: WaitingRoomComponent }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
