import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from './models/user';
import { AccountService } from './services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : string = 'The dating app';
  users : any;

  constructor(private http: HttpClient, private accountService : AccountService){  }

  ngOnInit(): void{ //happening just 1 time when the components uploading
    this.setCurrentUser();
  }
  // rxjs is a library that allows us to do asynchronous operations
  

  setCurrentUser(){
    const userFromLS:any = localStorage.getItem('user');
    const user : User = JSON.parse(userFromLS);
    this.accountService.setCurrentUser(user);
  }
}
