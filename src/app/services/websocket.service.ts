import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Observable } from "rxjs";
import { Message } from "../models/message";
import { Room } from "../models/room";
import { Player } from "../models/player";
import { Router } from "@angular/router";
import { AppConstant } from "src/environments/constants";
import { PersistanceService } from './persistance.service';
import { ToastType, ToasterService } from './toaster.service';

@Injectable({
  providedIn: "root"
})
export class WebsocketService {

  //local variables used and shared throughout components that use
  //this service
  socket: SocketIOClient.Socket;
  rooms: Room[] = [];
  activeRoom: Room;
  player: Player = {playerId: ''};
  test: boolean = false;

  initiated: boolean = false;
  private base: string = AppConstant.BASE_URL;

  constructor(private router: Router,
    private storage: PersistanceService,
    private toaster: ToasterService) {
    this.socket = io(this.base + "/");
    this.rooms = [];
    let fromStorage = this.storage.retrievePlayer();

    if (fromStorage) {
      this.setPlayer(fromStorage);
    }
  }

  //When we initialise, we set up listeners for certain websocket
  //commands/notifications
  public init() {
    if (!this.initiated) {
      // Whenever we get a rooms message,
      // we want to update our internal representation
      // of the rooms
      const roomObserver = new Observable(observer => {
        this.socket.on('rooms', data => {
          this.rooms = data as Room[];
        });
      }).subscribe();

      // Create a listener to listen for succesful joins
      const joinListener = new Observable(observer => {
        // once we get ajoin message we want to navigate to the room component
        this.socket.on('joinSuccess', player => {
          this.player = player;
          let room = this.rooms.filter(o => o.id === player.activeRoom)[0];
          this.activeRoom = room;
          this.test = true;
          this.router.navigateByUrl('room/' + player.activeRoom);
        });
      }).subscribe();

      // And new messages
      const messageListener = new Observable(observer => {
        this.socket.on('message', message => {
          this.activeRoom.messages.push(message);
        });
      }).subscribe();

      //listener for starting a game
      const gameListener = new Observable(obs => {
        this.socket.on('setup', game => {
          this.activeRoom.game = game;
        });
      }).subscribe();

      //for any sort of notifications, such as moves,
      //lobby joined events etc
      const notificationListener = new Observable(obs => {
        this.socket.on('notification', notification => {
          ToastType.SUCCESS
          this.toaster.createToast(notification.text, notification.type);
        });
      }).subscribe();
     
      this.initiated = true;

    }
  }

  // We want to be able to create a room
  createRoom(roomName: string, playerNumber: number) {
    const room: Room = { id: roomName, maxPlayers: 4, messages: [], players: [] };
    this.socket.emit('createRoom', room);
  }

  startGame() {
    if (this.activeRoom){
      this.socket.emit('startGame', this.activeRoom.id);
    }
  }

  // Wrapper for joining a room
  joinRoom(roomName: string) {
    this.socket.emit('joinRoom', roomName);
  }

  // Send a message to a certain room
  sendMessage(msg: string) {
    
    if (msg.length > 0) {
      const message: Message = { contents: msg, from: this.player.playerName};
      this.activeRoom.messages.push(message);
      this.socket.emit('messageRoom', message);
    }
   
  }

  setPlayer(player: Player) {
    this.player = player;
    this.socket.emit('setPlayer', player);
  }


  sendMove(move: any) {
    move.from = this.player.playerId;
    this.socket.emit('makeMove', move);
  }

  disconnect() {
    this.socket.emit('disconnect', '');
  }

  leaveRoom() {
    this.socket.emit('leaveRoom', null);
  }

}
