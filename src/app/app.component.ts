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

  viewAcc() {
    this.router.navigateByUrl('/viewAcc')
  }

  logout() {
    localStorage.clear();
    this.websocket.disconnect();
    this.router.navigateByUrl('/');
  }

  viewRooms() {
    this.router.navigateByUrl('/listRooms')
  }

}