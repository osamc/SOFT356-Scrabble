  import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { GameTile } from '../models/game';
import { ToasterComponent } from '../toaster/toaster.component';
import { ToasterService, ToastType } from '../services/toaster.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(private websocket: WebsocketService,
    private toaster: ToasterService) { }

  ngOnInit() {
  }

  activeTile: any = null; 
  tiles = [];
  moves = [];

  makeMove() {
    let moveRequest: any = {};

    let moves = JSON.parse(JSON.stringify(this.moves));
    let tiles = [];

    moves.sort((a,b) => a.x - b.x);
    moves.sort((a,b) => a.y - b.y);

    for(let i = 0; i < moves.length; i++) {
      for(let j = 0; j < moves.length; j++) {
        if (this.tiles[j].moveId === moves[i].moveId) {
          tiles.push(this.tiles[j]);
          break;
        }
      }
    }

    moveRequest.moves = moves;
    moveRequest.tiles = tiles;
    moveRequest.roomId = this.websocket.activeRoom.id;
    moveRequest.moveType = 'playTile';

    console.log(moveRequest);

    this.websocket.sendMove(moveRequest);

    this.moves = [];
    this.tiles = [];

  }

  placeTile(x: any, y:any) {

    if(this.websocket.activeRoom.game.yourTurn) {
      let boardTile = this.websocket.activeRoom.game.board[y][x];

      //If the tile is empty then we treat this is as a placement
      if (JSON.stringify(boardTile.tile) === '{}') {
        if (this.activeTile) {
          let cloned = JSON.parse(JSON.stringify(this.activeTile));
          cloned.moveId = this.moves.length;
          boardTile.tile = cloned;
          this.activeTile.used = true;
          this.activeTile = null;
          this.moves.push({x: x, y: y, moveId: cloned.moveId});
          this.tiles.push(cloned);
        }
      } else {
        
        if (this.moves.find(m => m.x == x && m.y == y)) {
           //Else we have to remove the tile from the board as
        //the player has most likely changed their mind
        let hand = this.websocket.activeRoom.game.hand;
        let tileToFind = boardTile.tile;
  
        for(let i = this.moves.length -1; i >= 0; i--) {
          if (this.moves[i].x == x  && this.moves[i].y == y){
            this.tiles.splice(tileToFind.moveId, 1);
            this.moves.splice(i,1);
            break;
          }
        }
  
  
        for(let i = 0; i < hand.length; i++) {
          if (hand[i].letter == tileToFind.letter && hand[i].used == true) {
            hand[i].used = false;
            hand[i].selected = false;
            break;
          }
        }
  
        boardTile.tile = {};
        }
       
  
      }
    } else {
      this.toaster.createToast('You are unable to play until it is your turn', ToastType.INFO);
    }

   
    
  }

  selectTile(tile: GameTile) {
  
    //if we have previously selected a tile then we must unselect it
    if(this.activeTile) {
      this.activeTile.selected = false;
    }

    //If the tile hasn't already been used then set it to the active tile
    if(!tile.used) {
      tile.selected = true;
      this.activeTile = tile;
    } else {
      this.toaster.createToast('This has already been played', ToastType.WARNING);
    }

  }



}
