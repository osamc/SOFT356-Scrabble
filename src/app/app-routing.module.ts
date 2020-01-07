import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';


const routes: Routes = [{path: 'listRooms',component: RoomListComponent},
{path:'room/:id', component: RoomComponent}, 
{path: '', component: LoginComponent},
{path: '*', component: LoginComponent}, 
{path: 'viewAcc', component: AccountComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
