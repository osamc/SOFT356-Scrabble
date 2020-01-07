import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Player } from '../models/player';
import { Room } from '../models/room';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  newRoomName: string;

  constructor(public webSockets: WebsocketService,
      private router: Router) {}

  ngOnInit() {
    this.webSockets.init();
    if (!this.webSockets.player) {
      this.router.navigateByUrl('/')
    }
  }


  createRoom(name: string) {
    this.webSockets.createRoom(name, 4);
  }

  joinRoom(room: Room) {
    this.webSockets.joinRoom(room.id);
  }

}
