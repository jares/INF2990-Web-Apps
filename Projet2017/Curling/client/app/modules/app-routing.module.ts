import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from '../components/dashboard.component';
import { UserComponent } from '../components/user.component';
import { GameComponent } from '../components/game.component';
import { DifficultyComponent } from '../components/difficulty.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'difficulty', component: DifficultyComponent},
  { path: 'login', component: UserComponent},
  { path: 'curling', component: GameComponent},
  { path: '**', redirectTo: 'login'}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
