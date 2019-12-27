import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player';
import {v4 as uuid} from 'uuid';
import {environment} from 'src/environments/environment'
import {AppConstant} from 'src/environments/constants'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private base: string = AppConstant.BASE_URL;

  constructor(private http: HttpClient) { 
  }

  public getPlayer(id: string) {
    return this.http.get(this.base + '/getPlayer/' + id);
  }

  public getPlayers() {
    return this.http.get(this.base + '/getPlayers');
  }

  public createPlayer(name:string) {
    let player: Player = {playerId: uuid().toString(), playerName: name};
    return this.http.post(this.base + '/createPlayer', player);
  }

  public deletePlayer(id: string) {
    return this.http.delete(this.base + "/deletePlayer/" + id);
  }

  public getPlayerCount() {
    return this.http.get(this.base + "/getPlayerCount");
  }


}
