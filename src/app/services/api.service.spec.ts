import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Player } from '../models/player';
import { doesNotThrow } from 'assert';

describe('ApiService', () => {

  let accountsCreated: Player[] = [];

  beforeEach(() => TestBed.configureTestingModule({imports: [HttpClientModule]}));

  afterAll(() => {
    const service: ApiService = TestBed.get(ApiService);

    try {
      let obs = [];
      accountsCreated.forEach(acc => {
        obs.push(service.deletePlayer(acc.playerId));
      });
  
      let deleteAll = forkJoin(obs);
      deleteAll.subscribe(() => {
        console.log("deleted all test accounts");
      });
    } catch (err) {
      console.log(err);
    }
    

  });

  //The service should be able to create 
  it('should create players', (done) => {
    console.log("Test to see if players can be created");
    //Get the service
    const service: ApiService = TestBed.get(ApiService);
    //Create a player with timestamp
    service.createPlayer(Date.now().toString()).subscribe(res => {
      //Case the response to a Player object
      let player: Player = <Player> res;
      let size = accountsCreated.length;
      accountsCreated.push(player);
      console.log("Expecting the number of accounts to be incramented by 1")
      expect(accountsCreated.length).toBe(size+1);
      done();
    });
  });

  it('Should be able to retrieve players', (done) => {
    console.log("The API should be able to retrieve players")
    const service: ApiService = TestBed.get(ApiService);
    service.createPlayer('test').subscribe(res => {
      let player = <Player> res;
      accountsCreated.push(player);
      service.getPlayer(player.playerId).subscribe(got => {
        console.log("Player before: ");
        console.log(JSON.stringify(player));
        console.log("Player after: ");
        console.log(JSON.stringify(got));
        expect((<Player>got).playerId === player.playerId).toBeTruthy();
        expect((<Player>got).playerName === player.playerName).toBeTruthy();
        done();
      }, err => {
        console.log(err);
      });
    });
  });


  it('Should be able to delete players', (done) => {
    console.log("The API should be able to delete players");
    const service: ApiService = TestBed.get(ApiService);
    service.createPlayer("test").subscribe(player => {
      service.deletePlayer((<Player>player).playerId).subscribe(() => {
        service.getPlayer((<Player>player).playerId).subscribe(res => {
          expect(res).toEqual(null);
          done();
        })
      })
    })
    

  })


});
