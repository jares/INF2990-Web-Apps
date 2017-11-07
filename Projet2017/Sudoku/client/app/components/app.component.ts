import { Component } from '@angular/core';
import { AppService } from '../services/app.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: '../assets/templates/app.component.html',
  styleUrls: ['../assets/stylesheets/app.component.css'],
  providers: [AppService]
})
export class AppComponent {
}
