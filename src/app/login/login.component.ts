import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {Md5} from 'ts-md5/dist/md5';
import { ApiService } from '../services/api.service';
import { Player } from '../models/player';
import { WebsocketService } from '../services/websocket.service';
import { Router } from '@angular/router';
import { PersistanceService } from '../services/persistance.service';
import { ToasterService, ToastType } from '../services/toaster.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signup: boolean = false;

  constructor(private api: ApiService,
    private websocket: WebsocketService,
    private router: Router,
    private storage: PersistanceService,
    private toaster: ToasterService,
    private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {
    let player = this.storage.retrievePlayer();
    if (player) {
      this.websocket.setPlayer(<Player> player);
      this.router.navigateByUrl('listRooms');
    }
  }

  login(username: string, password: string) {
    this.api.login(username, '' + Md5.hashStr(password)).subscribe(res => {
      console.log(res);
      let response: any = res;
      if (response.valid) {
        this.storage.storePlayer(<Player> response.player);
        this.websocket.setPlayer(<Player> response.player);
        this.router.navigateByUrl('/listRooms');
      }
    })
  }

  createAccount(login: string, username: string, pw: string) {
    let hashed:string = '' + Md5.hashStr(pw);
    if (login.length > 3 && username.length > 3 && pw.length > 3) {
      this.api.createPlayer(login, username, hashed).subscribe(res => {
        console.log(res);
        let response: any = res;
        if (response.valid) {
          this.storage.storePlayer(<Player> response.player);
          this.websocket.setPlayer(<Player> response.player);
          this.router.navigateByUrl('/listRooms');
        } else {
          this.toaster.createToast(response.reason, ToastType.WARNING);
        }
       
      });
    } else {
      this.toaster.createToast('missing fields required', ToastType.DANGER);
    }
    

  }

  updateForm() {
    this.changeDetector.markForCheck();
  }


}
