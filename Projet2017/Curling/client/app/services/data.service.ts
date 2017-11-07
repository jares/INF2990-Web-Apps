import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

const HEADERS = new Headers({'Content-Type': 'application/json'});
const OPTIONS = new RequestOptions({headers: HEADERS});

@Injectable()
export class DataService {
    constructor (private http: Http) {}

    public addUser(user: string): Observable<boolean> {
        return this.http.post('http://localhost:3002/user', {user}, OPTIONS).map(response => response.json());
    }

    public addScore(score: any): Observable<any> {
        return this.http.post('http://localhost:3002/leaderboard', {score}, OPTIONS).map(response => response.json());
    }

    public getScore(): Observable<any> {
        return this.http.get('http://localhost:3002/getleaderboard').map(response => response.json());
    }
}
