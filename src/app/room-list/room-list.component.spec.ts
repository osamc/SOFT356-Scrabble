import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListComponent } from './room-list.component';
import { DebugElement, Directive } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { WebsocketService } from '../services/websocket.service';
import { HttpClientModule } from '@angular/common/http';

describe('RoomListComponent', () => {
  let component: RoomListComponent;
  let fixture: ComponentFixture<RoomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [ RoomListComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListComponent);
    
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it ('There should be x number of cards for x number of rooms', () => {
    component.webSockets.rooms.push({id: 'test'});
    component.webSockets.rooms.push({id: 'test2'});
    fixture.detectChanges();
    let cards: DebugElement[] = fixture.debugElement.queryAll(By.css('.card'));
    expect(cards.length).toBe(2);
  }); 

});
