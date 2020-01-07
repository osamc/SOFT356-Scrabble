import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { GameComponent } from './game/game.component';
import { ToasterComponent } from './toaster/toaster.component';
import { AccountComponent } from './account/account.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    RoomListComponent,
    RoomComponent,
    LoginComponent,
    GameComponent,
    ToasterComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
