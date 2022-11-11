import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { User } from '../models/user';
import { AccountService } from '../services/account.service';


// we'll be using this directive like this" *appHasRole="['Admin']"

@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective implements OnInit {

    user: User;
    @Input() appHasRole: string[];
    
    constructor(
        private viewContainerRef: ViewContainerRef, // in short this let us make the element a type of a hook for other html (templates) to added to or remove from
        private templateRef: TemplateRef<any>,    
        private accountService: AccountService
    ) 
    { 
        this.accountService.currentUser$.pipe(
            take(1) // take 1 means we only want to take the first value, and that's it
            ).subscribe(user => {
            this.user = user;
          });
    }


    ngOnInit(): void {
        if(!this.user?.roles || this.user == null) {
            this.viewContainerRef.clear(); // simply clear the container from the views that can be in there
            return;
          }

          if (this.user.roles?.some(r => this.appHasRole.includes(r))) { //some is like Any in Linq
            // if they do, we'll show the element (the Admin nav button, what the templateRef is referencing)
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
      
          //if they don't, we'll clear the container
          else {
            this.viewContainerRef.clear();
          } 
    }
}