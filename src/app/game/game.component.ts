import { Component, OnInit, OnDestroy } from '@angular/core';
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
  
  constructor(public websocket: WebsocketService,
    public toaster: ToasterService) { }

  ngOnInit() {
  }

  //local variables
  exchangeMode = false;
  activeTile: any = null;
  tiles = [];
  moves = [];

  makeMove() {

    //We want to create the moverequest
    let moveRequest: any = {};
    let moves = JSON.parse(JSON.stringify(this.moves));
    let tiles = [];

    //we want to sort the x and y values into an
    //increasing order so  that they are in order
    moves.sort((a, b) => a.x - b.x);
    moves.sort((a, b) => a.y - b.y);

    //We then also iterate over the moves and place the tile that is
    //corresponding to them into the right position for the move
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves.length; j++) {
        if (this.tiles[j].moveId === moves[i].moveId) {
          tiles.push(this.tiles[j]);
          break;
        }
      }
    }

    //set all the right values
    moveRequest.moves = moves;
    moveRequest.tiles = tiles;
    moveRequest.roomId = this.websocket.activeRoom.id;
    moveRequest.moveType = 'playTile';

    //We send the move
    this.websocket.sendMove(moveRequest);

    //Then we clear all previous moves
    this.moves = [];
    this.tiles = [];

  }

  passTurn() {
    //Create a simple pass turn request
    let moveRequest: any = {};
    moveRequest.roomId = this.websocket.activeRoom.id;
    moveRequest.moveType = 'pass';
    this.websocket.sendMove(moveRequest);
  }

  exchangeTiles() {
    
    if (!this.exchangeMode) {
      //When we toggle exchange mode we want to pick up all placed tiles
      for (let i = 0; i < this.moves.length; i++) {
        this.pickUpTile(this.moves[i].x, this.moves[i].y);
        this.activeTile = null;
      }
    } else {
      //We want to clear the hand of any selected tiles or used tiles
      for (let i = 0; i < this.websocket.activeRoom.game.hand.length; i++) {
        this.websocket.activeRoom.game.hand[i].used = false;
        this.websocket.activeRoom.game.hand[i].selected = false;
        this.activeTile = null;
      }
    }

    this.tiles = [];
    this.moves = [];
    this.exchangeMode = !this.exchangeMode;
  }

  exchangeTurn() {
    //if we have more than 0 tiles then that's a valid 
    //exchange, we don't want the player wasting their turn
    //if they made a mistake
    if (this.tiles.length > 0) {
      //create a moverequest
      let moveRequest: any = {};
      moveRequest.roomId = this.websocket.activeRoom.id;
      moveRequest.moveType = 'exchange';
      moveRequest.tiles = this.tiles;
      this.websocket.sendMove(moveRequest);
      this.tiles = [];
      this.moves = [];
      this.exchangeMode = !this.exchangeMode;
    } else {
      this.toaster.createToast('You are unable to exchange 0 tiles', ToastType.DANGER);
    }
    
  }

  pickUpTile(x: any, y: any) {
    //if it is your turn and you select a tile,
    //then we should pick it up
     if (this.websocket.activeRoom.game.yourTurn) {
       let boardTile = this.websocket.activeRoom.game.board[y][x];

       //if the square isn't empty then we take a copy, 
       //and go iterate over the hand and make the tile playable again
       if (JSON.stringify(boardTile.tile) !== '{}') {
        let tileToAddToHand = JSON.parse(JSON.stringify(boardTile.tile));
        boardTile.tile = {};
        for (let i = 0; i < this.websocket.activeRoom.game.hand.length; i++) {
          if (this.websocket.activeRoom.game.hand[i].letter === tileToAddToHand.letter) {
            this.websocket.activeRoom.game.hand[i].used = false;
            this.websocket.activeRoom.game.hand[i].selected = false;
          }
        }
       }

     }
  } 

  placeTile(x: any, y: any) {
    if (this.websocket.activeRoom.game.yourTurn) {

      //If we're in exchange mode, then we should let the player know that they are
      //are unable to play the tile
      if (!this.exchangeMode) {
        let boardTile = this.websocket.activeRoom.game.board[y][x];

        //If the tile is empty then we treat this is as a placement
        if (JSON.stringify(boardTile.tile) === '{}') {
          if (this.activeTile && !this.activeTile.used) {
            let cloned = JSON.parse(JSON.stringify(this.activeTile));
            cloned.moveId = this.moves.length;
            boardTile.tile = cloned;
            this.activeTile.used = true;
            this.activeTile = null;
            this.moves.push({ x: x, y: y, moveId: cloned.moveId });
            this.tiles.push(cloned);
          }
        } else {

          if (this.moves.find(m => m.x == x && m.y == y)) {
            //Else we have to remove the tile from the board as
            //the player has most likely changed their mind
            let hand = this.websocket.activeRoom.game.hand;
            let tileToFind = boardTile.tile;

            for (let i = this.moves.length - 1; i >= 0; i--) {
              if (this.moves[i].x == x && this.moves[i].y == y) {
                this.tiles.splice(tileToFind.moveId, 1);
                this.moves.splice(i, 1);
                break;
              }
            }

            for (let i = 0; i < hand.length; i++) {
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
        this.toaster.createToast('Unable to place tiles in exchange mode', ToastType.INFO);
      }
    } else {
      this.toaster.createToast('You are unable to play until it is your turn', ToastType.INFO);
    }



  }

  selectTile(tile: GameTile) {
    //if we have previously selected a tile then we must unselect it
    if (this.activeTile) {
      this.activeTile.selected = false;
    }

    if (this.exchangeMode) {
      if (!this.tiles.includes(tile)) {
        this.tiles.push(tile);
        tile.selected = true;
      }  else {
        this.tiles.splice(this.tiles.indexOf(tile), 1);
        tile.selected = false;
      }
    } else {
      //If the tile hasn't already been used then set it to the active tile
      if (!tile.used) {
        tile.selected = true;
        this.activeTile = tile;
      } else {
        this.toaster.createToast('This has already been played', ToastType.WARNING);
      }
    }

  }



}
