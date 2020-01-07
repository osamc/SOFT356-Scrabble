import { Component, OnInit, Input, ViewChildren, AfterViewInit, QueryList, OnDestroy, HostListener } from '@angular/core';
import { WebsocketService } from '../services/websocket.service';
import { Message } from '../models/message';
import { Room } from '../models/room';
import { ToasterService, ToastType } from '../services/toaster.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, AfterViewInit, OnDestroy {

  public showChat = false;

  @ViewChildren('messageView') messageView: QueryList<any>;

  constructor(public websocket: WebsocketService,
    private toaster: ToasterService) { }

  ngOnInit() {
  }

  //After the page is initialised, we want to check for
  //any additional messages created. When a new one is added,
  //we want to scroll the message box to the very bottom
  ngAfterViewInit(): void {
    this.messageView.changes.subscribe(e => {
      var out = document.getElementById("messageView");
      out.scrollTop = out.scrollHeight;
    });
  }

  //When the component is destoryed,
  //we want to let the server know we left the room
  ngOnDestroy(): void {
    this.websocket.leaveRoom();
  }

  //same as when the window is "unloaded"
  //this is in situations like closing a tab
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event) {
    this.websocket.leaveRoom();
  }


  sendMessage(message: any) {
    this.websocket.sendMessage(message.value);
    message.value = "";
  }

  //Method to be called through angular binding
  toggleChat() {
    this.showChat = !this.showChat;
  }

  //Let the server know you're ready to start the game
  startGame() {
    //if the game is already active, don't recreate it
    if (!this.websocket.activeRoom.game) {
      this.websocket.startGame();
    } else {
      this.toaster.createToast('Unable to start game that has already started', ToastType.DANGER);
    }
  }

}
