import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SudokuComponent } from '../components/sudoku.component';
import { FormsModule } from '@angular/forms';
import { AppService } from '../services/app.service';
import { VerificatorService } from '../services/sudokuVerificator.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app.component';
import { UserComponent } from '../components/user.component';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  declarations: [AppComponent, SudokuComponent, UserComponent],
  providers: [AppService, VerificatorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
