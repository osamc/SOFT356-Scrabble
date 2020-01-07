import { Injectable } from '@angular/core';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root'
})
export class PersistanceService {

  constructor() { }

  storePlayer(player: Player) {
    localStorage.setItem('player', JSON.stringify(player));
  }

  retrievePlayer(): Player {
    let json = localStorage.getItem('player');
    return json ? <Player> JSON.parse(json) : null;
  }

  //Clear is used when we log out
  clear() {
    localStorage.clear();
  }
 

}
