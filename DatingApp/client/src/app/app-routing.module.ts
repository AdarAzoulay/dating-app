import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { AuthGuard } from './guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';

const routes: Routes = [
  {
    path: '', // localhost:4200
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'members', // localhost:4200/members
        loadChildren: () =>
          import('./modules/members.module').then((mod) => mod.MembersModule),
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ],
  },
  {
    path: 'errors',
    component: TestErrorsComponent
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: 'server-error',
    component: ServerErrorComponent
  },
  {
    path: '**', // localhost:4200/anything
    component: NotFoundComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
