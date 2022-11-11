import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group';
import { Message } from '../models/message';
import { User } from '../models/user';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  baseUrl = environment.apiUrl; // for http
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  private messageThreadSource$ = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource$.asObservable();


  constructor(private http: HttpClient) { }

  createHubConnection(user: User, otherUsername: string) {
    //create a connection using a builder
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}message?username=${otherUsername}`, { // passing the other user's username as a query string
        accessTokenFactory: () => user.token // authenticate using the user's token
      })
      .withAutomaticReconnect() // to try and reconnect if the connection is lost
      .build();

    this.hubConnection.start().catch(err => console.error(err));

    this.hubConnection.on('ReceiveMessageThread', (messages: Message[]) => {
      this.messageThreadSource$.next(messages);
    });

    this.hubConnection.on('NewMessage', (message: Message) => {
      const currentMessages = this.messageThreadSource$.getValue();
      this.messageThreadSource$.next([...currentMessages, message]);
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUsername)) {
        this.messageThread$.pipe(take(1)).subscribe((messages: Message[]) => {
          messages.forEach(message => {
            if (!message.dateRead)
              message.dateRead = new Date(Date.now());
          });
          this.messageThreadSource$.next([...messages]);
        });
      }
  });
  }
  

  stopHubConnection() {
    if(this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessages(pageNumber:number, pageSize:number, container:string) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);

  }

  getMessageThread(username: string){
    return this.http.get<Message[]>(`${this.baseUrl}messages/thread/${username}`);
  }

  sendMessage(username:string, content:string) {
    const createMessage = {recipientUsername: username, content};
    return this.hubConnection.invoke('SendMessage', createMessage)
              //now this does not return an observable like API call, this returns a promise, and we don't have access to our interceptor to handle the response
              .catch(error => console.log(error));
  }

  deleteMessage(id:number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }

}
