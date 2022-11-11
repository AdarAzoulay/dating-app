import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { PresenceService } from './services/presence.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string = 'The dating app';
  users : any;

  constructor(private presenceService: PresenceService, private accountService : AccountService){  }

  ngOnInit(): void{ //happening just 1 time when the components uploading
    this.setCurrentUser();
  }
  
  setCurrentUser(){
    const userFromLS:any = localStorage.getItem('user');
    const user : User = JSON.parse(userFromLS);
    if(user) {
      this.accountService.setCurrentUser(user);
      this.presenceService.createHubConnection(user);
    }
  }
}
