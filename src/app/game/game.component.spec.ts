import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  let fakeActiveRoom = JSON.parse('{"id":"ccewfewvewfew","maxPlayers":4,"messages":[],"players":[{"playerId":"f5a8c6cb-d970-4460-adac-99f17680c425","playerName":"sam","words":[],"socketId":"KbeMHsR-LPDjf_R3AAAa","score":0,"activeRoom":"ccewfewvewfew"}],"game":{"players":[{"playerId":"f5a8c6cb-d970-4460-adac-99f17680c425","playerName":"sam","words":[],"socketId":"KbeMHsR-LPDjf_R3AAAa","score":0,"activeRoom":"ccewfewvewfew"}],"board":[[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"centre","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}]],"activePlayer":"f5a8c6cb-d970-4460-adac-99f17680c425","turns":[],"state":"active","hand":[{"letter":"r","value":1},{"letter":"n","value":1},{"letter":"x","value":8},{"letter":"y","value":4},{"letter":"o","value":1},{"letter":"n","value":1},{"letter":"t","value":1},{"letter":"y","value":4}],"yourTurn":true}}');
 
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ GameComponent]
    })
    .compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    component.websocket.activeRoom = fakeActiveRoom;
    fixture.detectChanges();
  });

  it ('The component should render the game board', () => {
    fixture.detectChanges();
    let tiles: DebugElement[] = fixture.debugElement.queryAll(By.css('.tile'));
    expect(tiles.length).toEqual(225);
  });


  it ('When play is pressed, the make move method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#makeMove'));
    var spy = spyOn(component, 'makeMove');
    button.nativeElement.click();
    expect(spy);
    expect(component.makeMove).toHaveBeenCalled();
  });

  it ('When pass turn is pressed, the make move method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#passTurn'));
    var spy = spyOn(component, 'passTurn');
    button.nativeElement.click();
    expect(spy);
    expect(component.passTurn).toHaveBeenCalled();
  });

  it ('When the exchange tile button is pressed, the correct method should be called', () => {
    let button: DebugElement = fixture.debugElement.query(By.css('#exchangeTiles'));
    var spy = spyOn(component, 'exchangeTiles');
    button.nativeElement.click();
    expect(spy);
    fixture.detectChanges();
    expect(component.exchangeTiles).toHaveBeenCalled();
  });

  it ('The hand should react properly when items are added or selected', () => {
    component.websocket.activeRoom.game.hand = [{letter: 'l', value: 2}];
    let tile = component.websocket.activeRoom.game.hand[0];
    //tile.selected = true;
    component.selectTile(tile);
    fixture.detectChanges();
    
    let tiles: DebugElement[] = fixture.debugElement.queryAll(By.css('.selected'));
    
    expect(tiles.length).toEqual(1);

    tiles = fixture.debugElement.queryAll(By.css('.inhand'));

    expect(tiles.length).toEqual(1);

    component.websocket.activeRoom.game.hand.push(tile);
    fixture.detectChanges();

    tiles = fixture.debugElement.queryAll(By.css('.inhand'));

    expect(tiles.length).toEqual(2);

    tile.used = true;
    fixture.detectChanges();

    tiles = fixture.debugElement.queryAll(By.css('.inplay'));

    expect(tiles.length).toEqual(2);

  });

  it('When a tile is placed, it should be shown on the board', () => {
    component.websocket.activeRoom.game.hand = [{letter: 'l', value: 2}];
    let tile = component.websocket.activeRoom.game.hand[0];
    //tile.selected = true;
    component.selectTile(tile);
    component.placeTile(7,7);
    fixture.detectChanges();
    let tiles: DebugElement[] = fixture.debugElement.queryAll(By.css('.gamePiece'));
    //There are two as one is in hand
    expect(tiles.length).toEqual(2);

  });


});
