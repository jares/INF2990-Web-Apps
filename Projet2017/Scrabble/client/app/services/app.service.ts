import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AppService {
    constructor (private http: Http) {}

    fetchData(){
        return this.http.get('app/board.json').map(response => response.json());
    }

    addUser(user: string) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        return this.http.post('http://localhost:3002/user', {user}, options).map(response => response.text());
    }

}


   // return this.http.get('app/board.json').map(response => response.json()
