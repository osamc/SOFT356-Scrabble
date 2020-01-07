import { Component, OnInit, Input, ViewChildren, AfterViewInit, QueryList, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '../models/message';
import { Room } from '../models/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {

  public showChat = false;

  @ViewChildren('messageView') messageView: QueryList<any>;

  constructor(public websocket: WebsocketService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.messageView.changes.subscribe(e => {
      var out = document.getElementById("messageView");
      out.scrollTop = out.scrollHeight;
    });
  }

  ngOnDestroy(): void {
    this.websocket.leaveRoom();
  }

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event) {
    this.websocket.leaveRoom();
  }

  sendMessage(message: any) {
    this.websocket.sendMessage(message.value);
    message.value = "";
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }


  startGame() {
    this.websocket.startGame();
  }

}
