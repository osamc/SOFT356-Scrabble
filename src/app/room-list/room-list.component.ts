import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Player } from '../models/player';
import { Room } from '../models/room';
import { Router } from '@angular/router';
import { PersistanceService } from '../services/persistance.service';
import { ApiService } from '../services/api.service';
import { ToasterService } from '../services/toaster.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

  newRoomName: string;

  constructor(public webSockets: WebsocketService,
    private router: Router,
    private persistance: PersistanceService,
    private api: ApiService,
    private toaster: ToasterService) { }

  ngOnInit() {
    //Similar to other components, 
    //if we're not logged in then we want to
    //redirect them to the relevent place
    let player = this.persistance.retrievePlayer();
    console.log(player);
    if (player) {
      this.api.getPlayer(player.playerId).subscribe(res => {
        console.log();
        if (!res) {
          this.persistance.clear();
          this.router.navigateByUrl('/')
        } else {
          this.webSockets.init();
          if (!this.webSockets.player) {
            this.router.navigateByUrl('/')
          }
        }
      })
    }
  }

  createRoom(name: string) {
    this.webSockets.createRoom(name, 4);
  }

  joinRoom(room: Room) {
    this.webSockets.joinRoom(room.id);
  }

}
