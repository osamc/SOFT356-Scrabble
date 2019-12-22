import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  constructor(public websocket: WebsocketService) { }

  ngOnInit() {
  }

  sendMessage(message: string) {
    this.websocket.sendMessage(message);
  }

}
