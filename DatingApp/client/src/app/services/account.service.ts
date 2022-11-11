import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PresenceService } from './presence.service';


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource$ = new ReplaySubject<User>(1);
  public currentUser$ = this.currentUserSource$.asObservable();

  constructor(private http: HttpClient, private presenceService: PresenceService) { }
    
    login(model:any): Observable<any> {
      return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
        map((response : User)=>{
            const user = response;
            if (user) {

              this.setCurrentUser(user);
              this.presenceService.createHubConnection(user);
              // localStorage.setItem('user', JSON.stringify(user));
              // this.currentUserSource$.next(user);
            
            }
        })
      );
    }

    setCurrentUser(user:User){
      user.roles = [];
      const roles = this.getDecodedToken(user.token).role;
      Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSource$.next(user);
    }

    logout(){
      localStorage.removeItem('user');
      this.currentUserSource$.next();
      this.presenceService.stopHubConnection();
    }

    register(model:any): Observable<any>{
      return this.http.post<User>(this.baseUrl + 'account/register',model).pipe(
        map((user:User)=>{
          if(user){

            this.setCurrentUser(user);
            this.presenceService.createHubConnection(user);
            // localStorage.setItem('user', JSON.stringify(user));
            // this.currentUserSource$.next(user);
          }
          return user;
        })
      )
    }

    getDecodedToken(token: string) {
      const tokenParts = token.split('.');
      const payload = tokenParts[1];
      //we need to decode the payload
      const decodedPayload = atob(payload); //atob is a built-in function in js that decodes base64
      return JSON.parse(decodedPayload);
    }
  }
