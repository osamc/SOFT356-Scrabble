import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Player } from '../models/player';
import { Room } from '../models/room';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  newRoomName: string;

  constructor(public webSockets: WebsocketService) {}

  ngOnInit() {
  }


  createRoom(name: string) {
    this.webSockets.createRoom(name, 4);
  }

  joinRoom(room: Room) {
    this.webSockets.joinRoom(room.id);
  }




}
