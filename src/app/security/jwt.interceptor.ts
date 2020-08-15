import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    
    constructor(private apiauthService: AuthService){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const usuario = this.apiauthService.usuarioData;
        if (usuario) {
            request = request.clone({
                setHeaders: {
                    'Contend-Type': 'application/json'
                }
            });
        }

        return next.handle(request);
    }
}
