import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../src/environments/environment";
import { UsersModel } from '../models/users.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../models/response.model';
import { PostsModel } from '../models/posts.model';
import { ResponseGoRestModel } from '../models/respgorest.model';

//'Contend-Type': 'application/json',
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
export class UsersService {

    endPoint = environment.apiURL;
    endPointgorest = environment.apiURLgorest;

    constructor(private _http: HttpClient) { }    

    register(user: UsersModel): Observable<ResponseModel> {
        return this._http.post<ResponseModel>(`${this.endPoint}/users/insert`, user, httpOptions);
    }

    registergorest(user: UsersModel): Observable<ResponseGoRestModel> {
        return this._http.post<ResponseGoRestModel>(`${this.endPointgorest}/users?access-token=${environment.token}`, user, httpOptionsgorest);
    }
}