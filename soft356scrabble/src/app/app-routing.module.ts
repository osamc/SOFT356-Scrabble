import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';


const routes: Routes = [{path: 'listRooms',component: RoomListComponent},
{path: '', redirectTo: '/listRooms', pathMatch: 'full'},
{path:'room/:id', component: RoomComponent}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
