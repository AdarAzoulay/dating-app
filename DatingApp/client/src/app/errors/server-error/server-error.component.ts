import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {
  error:any;
  constructor(private router:Router) {
    const nvaigation = this.router.getCurrentNavigation();
    this.error = nvaigation?.extras?.state?.error; // ?.optional chaining
   }

  ngOnInit(): void {
  }

}
