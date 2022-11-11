import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  hubUrl = environment.hubUrl;

  private onlineUsersSource$ = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource$.asObservable();

  private hubConnection: HubConnection;

  constructor(private toastr: ToastrService, private router: Router) {}

  createHubConnection(user: User) {
    // we passing the user because we'll need to sent the jwt when we make the connection as well
    // * we cannot use the interceptor, it's good for http, and this is not http anymore, it's websocket
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}presence`, {
        // this method is to get and add the access token to every message
        accessTokenFactory: () => user.token,
      })
      // we also want to reconnect automatically when the connection is lost
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('UserIsOnline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe(onlineUsers => this.onlineUsersSource$.next([...onlineUsers, username]));
    });
    this.hubConnection.on('UserIsOffline', (username) => {
      this.onlineUsers$.pipe(take(1)).subscribe(onlineUsers => this.onlineUsersSource$.next([...onlineUsers.filter(u => u !== username)]));
    });

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource$.next(usernames);
    });

    this.hubConnection.on('NewMessageReceived', ({ username, knownAs }) => {
      this.toastr
        .info(`${knownAs} send you a new message!`)
        .onTap.pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl(`/members/${username}?tab=3`);
        });
    });
  }

  stopHubConnection() {
    this.hubConnection.stop().catch((error) => console.log(error));
  }
}
