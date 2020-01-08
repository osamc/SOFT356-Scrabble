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

  //Set up local variables for game history
  //and a boolean to control is the section is shown or not
  gameHistory: any[] = [];
  showHistory: boolean = false;

  ngOnInit() {
    //When the component loads, we want to get the most up to date version of the 
    //player from the db. We then want to iterate over their gamehistory to create 
    //an array of observables that we can fork join
    this.api.getPlayer(this.websocket.player.playerId).subscribe(res => {
      let response: any = res;

      if (res) {
        this.websocket.player = response;

        let obs: Observable<any>[] = [];
  
        if (this.websocket.player.gameHistory) {
          for (let i = 0; i < this.websocket.player.gameHistory.length; i++) {
            let game = this.websocket.player.gameHistory[i];
            obs.push(this.api.getGame(game));
          }
    
          let join = forkJoin(obs);
          
          //We then subscribe to the set of observables,
          //once we get a response we want to 
          //parse the turn data and create user readable 
          //turn data
          join.subscribe(jRes => {
            this.gameHistory = jRes;
            for (let i = 0; i < this.gameHistory.length; i++) {
              let game = this.gameHistory[i].game;
              game.parsedTurns = [];
              for (let j = 0; j < game.turns.length; j++) {
                game.parsedTurns.push(this.convertTurnToString(game, game.turns[j]));
              }
            }
            //We want to reverse this as the list would be shown oldest to newest
            this.gameHistory.reverse();
          });
        }
      }
    });
  }

  //We want to be able to turn a move into a readable text
  convertTurnToString(game: Game, turn: Turn) {
    //Get the player so we can link the id to a player name
    let player = game.players.filter(p => p.playerId.localeCompare(turn.from) == 0)[0];
    let turnString = "";
    if (player) {
      turnString = "Player: " + player.playerName + " has ";
      //Then depending on movetype, we append a different piece of text
      switch (turn.moveType) {
        case 'pass':
          turnString += "passed their turn."
          break;
        case 'exchange':
          turnString += "exchanged " + turn.tiles.length + " tiles.";
          break;
        case 'playTile':
          turnString += 'played: ';

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
