import { Component, OnInit } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import { ApiService } from '../services/api.service';
import { Player } from '../models/player';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private api: ApiService,
    private websocket: WebsocketService,
    private router: Router) {}

  ngOnInit() {}

  createPlayer(name: string) {
    this.api.createPlayer(name).subscribe(res => {
      this.websocket.player = <Player> res;
      this.router.navigateByUrl('/listRooms');
    });
  }




}
