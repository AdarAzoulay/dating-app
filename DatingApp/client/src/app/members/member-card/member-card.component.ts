import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { MembersService } from 'src/app/services/member.service';
import { PresenceService } from 'src/app/services/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css'],
})
export class MemberCardComponent implements OnInit {
  @Input() member!: Member; //! means that This property must have value of type Member
  constructor(
    private memberService: MembersService,
    private toastr: ToastrService,
    public presence: PresenceService //public because we'll access onlineUsers$ in the template

  ) {}

  ngOnInit(): void {}

  addLike(member:Member){
    this.memberService.addLike(member.userName).subscribe(
      ()=>{
        this.toastr.success(`You have liked: ${member.knownAs}`);
      }
    )
  }
}
