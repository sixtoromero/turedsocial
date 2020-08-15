import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../src/environments/environment";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../models/response.model';
import { PostsModel } from '../models/posts.model';

const httpOptionsgorest = {
    headers: new HttpHeaders({
        'Authorization': "Bearer " + environment.token
    })
};

const httpOptions = {
    headers: new HttpHeaders({
        'Contend-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root',
})
export class PostsService {

    endPoint = environment.apiURL;
    endPointgorest = environment.apiURLgorest;

    constructor(private _http: HttpClient) { }

    getposts(): Observable<PostsModel> {
        return this._http.get<PostsModel>(`${this.endPointgorest}/posts?access-token=${environment.token}`);
    }


}