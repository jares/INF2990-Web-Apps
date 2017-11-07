import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GameComponent } from '../components/game.component';
import { UserComponent } from '../components/user.component';
import { DashboardComponent } from '../components/dashboard.component';
import { DifficultyComponent } from '../components/difficulty.component';

import { RenderService } from '../services/render.service';
import { DataService } from '../services/data.service';
import { SceneUpdateService } from '../services/sceneUpdate.service';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [AppComponent, DashboardComponent, GameComponent, UserComponent,
    DifficultyComponent],
  providers: [RenderService, DataService, SceneUpdateService],
  bootstrap: [AppComponent]
})

export class AppModule { }
