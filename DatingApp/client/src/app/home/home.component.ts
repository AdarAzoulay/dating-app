import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  users : any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsers();
  }

    registerToggle(){
      this.registerMode = !this.registerMode;
    }

    getUsers(){
      this.http.get('https://localhost:5001/api/users').subscribe(
        // response => {
        //   this.users = response;
        // },
        // error => {
        //   console.log(error);
        // },
        // () => {
        //   console.log('FINISHED')
        // }
        {
          next: response => {
            this.users = response;
            console.log(response);
          }, // what to do with returned data
          error: error => {console.log(error);}, // what to do with error
          complete: () => {console.log('Finished');} // what to do when finished
        }
  
      )
    }

    cancelRegisterMode(event:boolean){
      console.log(event)
      this.registerMode = event;
    }
}
