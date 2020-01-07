import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountComponent } from './account.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  let game = JSON.parse('{"players":[{"playerId":"e630a1ff-747d-4cc4-ac9c-7533d3ad68cc","playerName":"test2","words":["rises"],"socketId":"BcQuXGoVDjwYqkK6AAAC","score":12,"hand":[{"letter":"o","value":1},{"letter":"c","value":3},{"letter":"s","value":1},{"letter":"n","value":1},{"letter":"n","value":1},{"letter":"o","value":1},{"letter":"o","value":1},{"letter":"t","value":1}]},{"playerId":"b58573f3-fb81-4d06-a82c-b8ad43ea3069","playerName":"test","words":["mark"],"socketId":"5X2xSghk9yoJWfNCAAAA","score":10,"hand":[{"letter":"u","value":1},{"letter":"j","value":8},{"letter":"i","value":1},{"letter":"x","value":8},{"letter":"i","value":1},{"letter":"a","value":1},{"letter":"y","value":4},{"letter":"h","value":4}]}],"_id":"5e13b87b67bf16181c7d0f43","id":"9f80cc71dd65abdcddd6e826d787ee7c","maxPlayers":4,"createDate":"2020-01-06T22:44:43.462Z","name":"test","game":{"players":[{"playerId":"e630a1ff-747d-4cc4-ac9c-7533d3ad68cc","playerName":"test2","words":["rises"],"socketId":"BcQuXGoVDjwYqkK6AAAC","score":12,"hand":[{"letter":"o","value":1},{"letter":"c","value":3},{"letter":"s","value":1},{"letter":"n","value":1},{"letter":"n","value":1},{"letter":"o","value":1},{"letter":"o","value":1},{"letter":"t","value":1}]},{"playerId":"b58573f3-fb81-4d06-a82c-b8ad43ea3069","playerName":"test","words":["mark"],"socketId":"5X2xSghk9yoJWfNCAAAA","score":10,"hand":[{"letter":"u","value":1},{"letter":"j","value":8},{"letter":"i","value":1},{"letter":"x","value":8},{"letter":"i","value":1},{"letter":"a","value":1},{"letter":"y","value":4},{"letter":"h","value":4}]}],"handSize":8,"turns":[{"moves":[{"x":7,"y":7,"moveId":0},{"x":8,"y":7,"moveId":1},{"x":9,"y":7,"moveId":2},{"x":10,"y":7,"moveId":3},{"x":11,"y":7,"moveId":4}],"tiles":[{"letter":"r","value":1,"selected":true,"moveId":0},{"letter":"i","value":1,"selected":true,"moveId":1},{"letter":"s","value":1,"selected":true,"moveId":2},{"letter":"e","value":1,"selected":true,"moveId":3},{"letter":"s","value":1,"selected":true,"used":false,"moveId":4}],"roomId":"9f80cc71dd65abdcddd6e826d787ee7c","moveType":"playTile","from":"e630a1ff-747d-4cc4-ac9c-7533d3ad68cc"},{"moves":[{"x":7,"y":5,"moveId":0},{"x":7,"y":6,"moveId":1},{"x":7,"y":8,"moveId":2}],"tiles":[{"letter":"m","value":3,"selected":true,"moveId":0},{"letter":"a","value":1,"selected":true,"moveId":1},{"letter":"k","value":5,"selected":true,"moveId":2}],"roomId":"9f80cc71dd65abdcddd6e826d787ee7c","moveType":"playTile","from":"b58573f3-fb81-4d06-a82c-b8ad43ea3069"},{"roomId":"9f80cc71dd65abdcddd6e826d787ee7c","moveType":"pass","from":"e630a1ff-747d-4cc4-ac9c-7533d3ad68cc"},{"roomId":"9f80cc71dd65abdcddd6e826d787ee7c","moveType":"pass","from":"b58573f3-fb81-4d06-a82c-b8ad43ea3069"},{"roomId":"9f80cc71dd65abdcddd6e826d787ee7c","moveType":"pass","from":"e630a1ff-747d-4cc4-ac9c-7533d3ad68cc"}],"poolCount":74,"board":[[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"m","value":3,"selected":true,"moveId":0},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"a","value":1,"selected":true,"moveId":1},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"centre","multiplier":2,"tile":{"letter":"r","value":1,"selected":true,"moveId":0},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"i","value":1,"selected":true,"moveId":1},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"s","value":1,"selected":true,"moveId":2},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"e","value":1,"selected":true,"moveId":3},"used":false},{"type":"letter","multiplier":2,"tile":{"letter":"s","value":1,"selected":true,"used":false,"moveId":4},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{"letter":"k","value":5,"selected":true,"moveId":2},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false}],[{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"letter","multiplier":2,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"none","multiplier":0,"tile":{},"used":false},{"type":"word","multiplier":3,"tile":{},"used":false}]],"parsedTurns":["Player: test2 has has played:  R , I , S , E , S ","Player: test has has played:  M , A , K ","Player: test2 has passed their turn.","Player: test has passed their turn.","Player: test2 has passed their turn."]},"__v":0}');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountComponent],
      imports: [FormsModule, RouterTestingModule, HttpClientModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    component.websocket.player = {playerId: 'test', playerName: 'test'};
    fixture.detectChanges();
  });


  it ('Should create a new history item for each game', () => {
    component.showHistory = true;
    component.gameHistory.push(game);
  
    fixture.detectChanges();
    let cards: DebugElement[] = fixture.debugElement.queryAll(By.css('.card'));

    expect(cards.length).toEqual(1);

    component.gameHistory.push(game);

    fixture.detectChanges();
    cards = fixture.debugElement.queryAll(By.css('.card'));

    expect(cards.length).toEqual(2);
  });

  it('The history section should hide when the boolean is false', () => {
    component.showHistory = true;
    component.gameHistory.push(game);
  
    fixture.detectChanges();
    let history: DebugElement[] = fixture.debugElement.queryAll(By.css('.history'));

    expect(history.length).toEqual(1);

    component.showHistory = false;
    fixture.detectChanges();
    history = fixture.debugElement.queryAll(By.css('.history'));

    expect(history.length).toEqual(0);

  });

  it ('The button should toggle the history', () => {
    let historyButton: DebugElement = fixture.debugElement.query(By.css('.showHistory'));
    component.showHistory = true;
    fixture.detectChanges();
    let history: DebugElement[] = fixture.debugElement.queryAll(By.css('.history'));

    expect(history.length).toEqual(1);
    
    historyButton.nativeElement.click();

    fixture.detectChanges();
    history = fixture.debugElement.queryAll(By.css('.history'));

    expect(history.length).toEqual(0);

  });

  it ('The component should be able to parse turns into useful text', () => {
    let turnString = component.convertTurnToString(game.game, game.game.turns[0]);
    expect(turnString).toEqual('Player: test2 has played:  R , I , S , E , S ');
    turnString = component.convertTurnToString(game.game, game.game.turns[2]);
    expect(turnString).toEqual('Player: test2 has passed their turn.');
  });




});
