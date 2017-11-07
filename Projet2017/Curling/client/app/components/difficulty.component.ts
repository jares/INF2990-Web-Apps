import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UserCurling } from '../classes/userCurling';

@Component({
    selector: 'my-difficulty',
    templateUrl: "assets/templates/difficulty-component-template.html",
    styleUrls: ['assets/stylesheets/difficulty.component.css']
})

export class DifficultyComponent {
    private choice: string;

    constructor(private router: Router) {
        console.log("difficulty.component");
        if (UserCurling.page !== 1) {
            console.log("difficulty.component - username undefined, routing to login");
            this.router.navigate(['/login']);
        }
    }

    public startGame(): void {
        UserCurling.normalAI = this.choice === "normal";
        UserCurling.page = 2;
        this.router.navigate(['/curling']);
    }
}
