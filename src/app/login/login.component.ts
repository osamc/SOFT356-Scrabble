import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { sha256 } from 'js-sha256'
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
    //When the user navigates to the login page
    //if they are logged in we want to ressurrect the
    //the player and navigate them to the list rooms component
    let player = this.storage.retrievePlayer();
    if (player) {
      this.websocket.setPlayer(<Player> player);
      this.router.navigateByUrl('listRooms');
    }
  }


  login(username: string, password: string) {
    //We want to use the api service to perform a login request
    this.api.login(username, '' + sha256(password)).subscribe(res => {
      let response: any = res;
      //if the login response is valid, then login
      if (response.valid) {
        this.storage.storePlayer(<Player> response.player);
        this.websocket.setPlayer(<Player> response.player);
        this.router.navigateByUrl('/listRooms');
      } else {
        this.toaster.createToast('Unsuccessful Login attempt', ToastType.DANGER);
      }
    })
  }

  createAccount(login: string, username: string, pw: string) {
    let hashed:string = sha256(pw);
    if (login.length >= 3 && username.length >= 3 && pw.length >= 3) {
      this.api.createPlayer(login, username, hashed).subscribe(res => {
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
      if (login.length == 0 || username.length == 0 || pw.length == 0) {
        this.toaster.createToast('Each parameter must be provided', ToastType.DANGER);
      } else {
        this.toaster.createToast('Each parameter must be 3 letters long', ToastType.DANGER);
      }
      
    }
    

  }

  updateForm() {
    this.changeDetector.markForCheck();
  }


}
