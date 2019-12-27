import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../models/message'
import { Room } from '../models/room'
import { Player } from '../models/player';
import { Router } from '@angular/router';
import { AppConstant } from 'src/environments/constants';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: SocketIOClient.Socket;
  rooms: Room[];
  activeRoom: Room;
  player: Player;

  initiated: boolean = false;
  private base: string = AppConstant.BASE_URL;

  constructor(private router: Router) {
  }

  public init() {

    if (!this.initiated) {
  //we connect to the socket io server
  this.socket = io(this.base + '/'); 

  //Whenever we get a rooms message,
  //we want to update our internal representation
  //of the rooms
  let roomObserver = new Observable(observer => {
    this.socket.on('rooms', data => {
      this.rooms = data as Room[];
    })
  }).subscribe();

  //Create a listener to listen for succesful joins
  let joinListener = new Observable(observer => {
    //once we get ajoin message we want to navigate to the room component
    this.socket.on('joinSuccess', player => {
      this.player = player;
      let room = this.rooms.filter(o => o.id === player.activeRoom)[0];
      this.activeRoom = room;
      this.router.navigateByUrl('room/' + player.activeRoom);
    })
  }).subscribe();

  //We want to listen to player updates
  let playerListener = new Observable(observer => {
    this.socket.on('player', player => {
      console.log(player);
      this.player = player;
    })
  }).subscribe();


  //And new messages
  let messageListener = new Observable(observer => {
    this.socket.on('message', message => {
      this.activeRoom.messages.push(message);
    })
  }).subscribe();
  this.initiated = true;
    }
    
  }
  
  //We want to be able to create a room
  createRoom(roomName: string, playerNumber: number) {
    let room: Room = {id: roomName, maxPlayers:4, messages: [], players: []};
    this.socket.emit('createRoom', room);
  }

  //Wrapper for joining a room
  joinRoom(roomName: string) {
    this.socket.emit("joinRoom", roomName);
  }

  //Send a message to a certain room
  sendMessage(msg: string) {
    let message: Message = {contents: msg, from: this.player.playerId};
    this.activeRoom.messages.push(message);
    this.socket.emit('messageRoom', message);
  }



}
