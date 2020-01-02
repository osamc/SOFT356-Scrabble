import { Component, OnInit, Input, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '../models/message';
import { Room } from '../models/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit{

  private showChat = false;

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

  sendMessage(message: any) {
    this.websocket.sendMessage(message.value);
    message.value = "";
  }

  toggleChat() {
    let chatbar = document.getElementById('myChatbar')
    let main = document.getElementById('main'); 
   
    if (this.showChat) {
      chatbar.style.width = "0";
      chatbar.style.padding = "0";
      main.style.marginLeft = '0';
    } else {
      chatbar.style.width = "25%";
      chatbar.style.padding = "1rem";
    }

    this.showChat = !this.showChat;

  }


  startGame() {

    this.websocket.startGame();
  }

}
