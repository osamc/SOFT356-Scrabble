import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { ApiService } from '../services/api.service';
import { Player } from '../models/player';
import { forkJoin, Observable } from 'rxjs';
import { Turn, Game } from '../models/game';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(public websocket: WebsocketService,
    private api: ApiService) { }

  gameHistory: any[] = [];
  showHistory: boolean = false;

  ngOnInit() {
    this.api.getPlayer(this.websocket.player.playerId).subscribe(res => {
      let response: any = res;
      this.websocket.player = response;

      let obs: Observable<any>[] = [];

      for (let i = 0; i < this.websocket.player.gameHistory.length; i++) {
        let game = this.websocket.player.gameHistory[i];
        obs.push(this.api.getGame(game));
      }

      let join = forkJoin(obs);
      join.subscribe(jRes => {
        let joinRes: any = jRes;
        this.gameHistory = joinRes;
        for (let i = 0; i < this.gameHistory.length; i++) {
          let game = this.gameHistory[i].game;
          game.parsedTurns = [];
          for (let j = 0; j < game.turns.length; j++) {
            game.parsedTurns.push(this.convertTurnToString(game, game.turns[j]));
          }
        }
        this.gameHistory.reverse();
      });

    });
  }

  convertTurnToString(game: Game, turn: Turn) {
    let player = game.players.filter(p => p.playerId.localeCompare(turn.from) == 0)[0];
    let turnString = "";
    if (player) {
      turnString = "Player: " + player.playerName + " has ";
      switch (turn.moveType) {
        case 'pass':
          turnString += "passed their turn."
          break;
        case 'exchange':
          turnString += "exchanged " + turn.tiles.length + " tiles.";
          break;
        case 'playTile':
          turnString += 'has played: ';

          for (let i = 0; i < turn.tiles.length; i++) {
            if (i != 0 && i != turn.tiles.length) {
              turnString += ',';
            }
            turnString += ' ' + turn.tiles[i].letter.toUpperCase() + ' ';
          }
          break;
      }
    }
    return turnString;
  }

}
