import { HttpEventType, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../src/environments/environment";
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../models/response.model';
import { PostsModel } from '../models/posts.model';
import { ResponseGoRestModel } from '../models/respgorest.model';

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

    getpostsByUserID(): Observable<ResponseGoRestModel> {
        const user_id = localStorage.getItem('user_id');
        return this._http.get<ResponseGoRestModel>(`${this.endPointgorest}/posts?access-token=${environment.token}&user_id=${user_id}`);
    }

    getposts(): Observable<ResponseGoRestModel> {
        const user_id = localStorage.getItem('user_id');
        return this._http.get<ResponseGoRestModel>(`${this.endPointgorest}/posts?access-token=${environment.token}`);
    }
    
    getPostByUserID(): Observable<ResponseModel> {
        const user_id = localStorage.getItem('user_id');
        return this._http.get<ResponseModel>(`${this.endPoint}/posts/getPostByUserID?user_id=${user_id}`);
    }

    register(post: PostsModel): Observable<ResponseGoRestModel> {
        return this._http.post<ResponseGoRestModel>(`${this.endPointgorest}/posts?access-token=${environment.token}`, post, httpOptionsgorest);
    }

    insert(ipost: PostsModel): Observable<ResponseModel> {
        return this._http.post<ResponseModel>(`${this.endPoint}/posts/insert`, ipost, httpOptions);
    }
}