import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() username:string;
  @Input() messages:Message[];
  messageContent:string;

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {
  }

  sendMessage(form:NgForm) {
    this.messageService.sendMessage(this.username, this.messageContent)
    .then(()=>{
      form.reset();
    })
  }


}
