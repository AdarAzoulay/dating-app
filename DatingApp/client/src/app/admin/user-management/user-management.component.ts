import { AdminService } from './../../services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: Partial<User[]> = [];
  bsModalRef: BsModalRef;

  constructor(
    private adminService: AdminService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUsersWithRoles();
  }

  getUsersWithRoles() {
    this.adminService
      .getUsersWithRoles()
      .subscribe((users: Partial<User[]>) => {
        this.users = users;
      });
  }

  openRolesModal(user: User) {
    const config: ModalOptions = {
      class: 'modal-dialog-centered', // make sure our modal is centered on the screen (https://getbootstrap.com/docs/4.1/components/modal/#vertically-centered)
      initialState: {
        user,
        roles: this.getRolesArray(user),
      },
    };
    // this will show the modal with the passed data (the 'list' property and 'title' property)
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);

    this.bsModalRef.content.updateSelectedRoles.subscribe((values:any[]) => {
      const roleValues = values.filter(el => el.checked).map(el => el.name);

      if (roleValues.length) {
        this.adminService.updateUserRoles(user.username, roleValues).subscribe(() => {
          user.roles = roleValues;
        }, error => {
          console.log(error);
        });
      }
      else {
        this.toastr.error(`User ${user.username} can't be with no roles!`);
      }
    });
    
  }
  getRolesArray(user: User) {
    const roles: any[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] = [
      { name: 'Admin', value: 'Admin' },
      { name: 'Moderator', value: 'Moderator' },
      { name: 'Member', value: 'Member' },
    ];

    availableRoles.forEach((role) => {
      let isMatch = false;
      for (const userRole of userRoles) {
        if (userRole === role.value) {
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if (!isMatch) {
        role.checked = false;
        roles.push(role);
      }
    });
    return roles;
  }
}
