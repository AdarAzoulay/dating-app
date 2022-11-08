import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private account: AccountService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let currentUser: User = {token:'', username:'', photoUrl:'', knownAs:'', gender:''};
        this.account.currentUser$.pipe(take(1)).subscribe(user=>currentUser=user);
        if(currentUser?.token){
            req = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
        }
        return next.handle(req);
    }
}