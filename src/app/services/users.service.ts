import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../../src/environments/environment";
import { UsersModel } from '../models/users.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseModel } from '../models/response.model';

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

    loginAL(email: string, password: string) {
        return this._http.post<UsersModel>(
            `${this.endPoint}/users?email=${email}&password=${password}`,
            {
                email,
                password,
            }
        );
    }

    // register(user: UsersModel): Observable<UsersModel> {
    //     return this._http.post<UsersModel>(`${this.endPoint}/users.json`, user, httpOptions);
    // }

    register(user: UsersModel): Observable<ResponseModel> {
        return this._http.post<ResponseModel>(`${this.endPoint}/users/insert`, user, httpOptions);
    }

    registergorest(user: UsersModel): Observable<UsersModel> {
        return this._http.post<UsersModel>(`${this.endPointgorest}/users?access-token=${environment.token}`, user, httpOptionsgorest);
    }
}

