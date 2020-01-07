import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'soft356scrabble';
  
  constructor(private router: Router,
    public websocket: WebsocketService) {}

  //use the router to navigate to a specific coponent to allow
  //for viewing of an account
  viewAcc() {
    this.router.navigateByUrl('/viewAcc')
  }

  //allow the user to affectively logout
  logout() {
    localStorage.clear();
    this.websocket.disconnect();
    this.router.navigateByUrl('/');
  }

  //navigate to the roomlist component
  viewRooms() {
    this.router.navigateByUrl('/listRooms')
  }

}