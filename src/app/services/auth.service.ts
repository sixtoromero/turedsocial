import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { environment } from 'src/environments/environment';
import { environment } from "../../../src/environments/environment";
import { UsersModel } from '../models/users.model';
import { ResponseModel } from '../models/response.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';



const httpOptionsgorest = {
    headers: new HttpHeaders({
        'Contend-Type': 'application/json',
        'Authorization': "bearer " + environment.token
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
export class AuthService {

    

    endPoint = environment.apiURL;
    endPointgorest = environment.apiURLgorest;

    private usuarioSubject: BehaviorSubject<UsersModel>

    public get usuarioData(): UsersModel {
        return this.usuarioSubject.value;
    }

    constructor(private _http: HttpClient) {
        this.usuarioSubject = new BehaviorSubject<UsersModel>(JSON.parse(localStorage.getItem('usuario')));
     }

    login(iuser: UsersModel): Observable<ResponseModel> {
        //return this._http.post<ResponseModel>(`${this.endPoint}/users/login`, iuser, httpOptionsgorest);
        return this._http.post<ResponseModel>(`${this.endPoint}/users/login`, iuser, httpOptions).pipe(
            map(res => {
                if (res.IsSuccess === true){
                    const user: UsersModel = res.Data;
                    localStorage.setItem('usuario', JSON.stringify(user));
                    localStorage.setItem('user_id', user.user_id);
                    this.usuarioSubject.next(user);
                }
                return res;
            })
        );
    }

    // login(email: string) {
    //     return this._http.get(`${this.endPoint}/users.json?orderBy="email"&equalTo="${email}"`);
    // }


    logout() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('user_id');
        this.usuarioSubject.next(null);
    }    

}
