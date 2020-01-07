import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomComponent } from './room.component';
import { GameComponent } from '../game/game.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ RoomComponent, GameComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent);
    fixture.componentInstance.websocket.activeRoom = {id: 'test'};
    fixture.componentInstance.websocket.activeRoom.messages = [];
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('The chat bar should show and hide when the local variable is changed', () => {
    component.showChat = true;
    fixture.detectChanges();

    let chatbar: DebugElement = fixture.debugElement.query(By.css('.chatbarShown'));
    let t = chatbar.nativeElement;

    expect(chatbar.classes['chatbarShown']).toBeTruthy();

    component.showChat = false;
    fixture.detectChanges();

    expect(chatbar.classes['chatbarShown']).toBeFalsy();

  });

  it('The chat should show messages when they are there', () => {
    component.showChat = true;
    
    component.websocket.activeRoom.messages.push({contents: 'test', from: 'test'});
    fixture.detectChanges();
    let messages: DebugElement[] = fixture.debugElement.queryAll(By.css('.message'));

    expect(messages.length).toEqual(1);

    component.websocket.activeRoom.messages.push({contents: 'test', from: 'test'});
    fixture.detectChanges();
    messages = fixture.debugElement.queryAll(By.css('.message'));

    expect(messages.length).toEqual(2);
  });

  it('When a message is sent, then the method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#sendMessage'));
    var spy = spyOn(component, 'sendMessage');
    button.nativeElement.click();
    expect(spy);
    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('When the toggle chat button is pressed, the toggle chat method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#toggleChat'));
    var spy = spyOn(component, 'toggleChat');
    button.nativeElement.click();
    expect(spy);
    expect(component.toggleChat).toHaveBeenCalled();
  });

  it('When the start game button is pressed, then the method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#startGame'));
    var spy = spyOn(component, 'startGame');
    button.nativeElement.click();
    expect(spy);
    expect(component.startGame).toHaveBeenCalled();
  })


});
