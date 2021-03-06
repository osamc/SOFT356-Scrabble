import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player } from '../models/player';
import { Room } from '../models/room'
import {v4 as uuid} from 'uuid';
import {AppConstant} from 'src/environments/constants'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //This base value will be different depending on
  //where it is deployed. This is dealt with production
  //and normal environment values
  private base: string = AppConstant.BASE_URL;

  constructor(private http: HttpClient) {}

  public getPlayer(id: string) {
    return this.http.get(this.base + '/getPlayer/' + id);
  }

  public getPlayers() {
    return this.http.get(this.base + '/getPlayers');
  }

  public createPlayer(login: string, username: string, pass: string) {
    const player: Player = {playerId: uuid().toString(), playerName: username, loginName: login, password: pass};
    return this.http.post(this.base + '/createPlayer', player);
  }

  public deletePlayer(id: string) {
    return this.http.delete(this.base + '/deletePlayer/' + id);
  }

  public getPlayerCount() {
    return this.http.get(this.base + '/getPlayerCount');
  }

  public updatePlayer(player: Player) {
    return this.http.post(this.base + '/updatePlayer', player);
  }

  public login(username: string, password: string) {
    return this.http.post(this.base + '/login', {'loginName': username, 'password': password});
  }

  public getGame(roomId) {
    return this.http.get(this.base + '/getGame/' + roomId);
  }


}
