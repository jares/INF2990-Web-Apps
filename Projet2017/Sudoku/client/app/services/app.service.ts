import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { User } from '../classes/user';
import 'rxjs/add/operator/map';



@Injectable()
export class AppService {

    static user: User;

    constructor(private http: Http) { }

    addUser(user: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:3002/user', { user }, options)
            .map(response => response.json());
    }

    requestSudoku(difficulty: string) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:3002/generation', { difficulty }, options)
            .map(response => response.json());
    }

    addUserScore(userScore: any) {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('http://localhost:3002/leaderboard', { userScore }, options)
            .map(response => response.json());
    }
}
