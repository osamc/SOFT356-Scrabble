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
    service.createPlayer(Date.now().toString(), Date.now().toString(), 'test').subscribe(result => {
      //Case the response to a Player object
      let res: any = result;
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
    service.createPlayer(Date.now().toString(), Date.now().toString(), 'test').subscribe(result => {
      let res: any = result;
      let player = <Player> res.player;
      console.log(res);
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
    service.createPlayer(Date.now().toString(), Date.now().toString(), 'test').subscribe(player => {
      service.deletePlayer((<Player>player).playerId).subscribe(() => {
        service.getPlayer((<Player>player).playerId).subscribe(res => {
          expect(res).toEqual(null);
          done();
        })
      })
    })
  });

  it('Should be able to update a player', (done) => {
    console.log("The api should be able to update the player");
    const service: ApiService = TestBed.get(ApiService);

    service.createPlayer(Date.now().toString(), Date.now().toString(), 'test').subscribe(result => {
      let res: any = result;
      let castResult = res.player;

      service.getPlayer(castResult.playerId).subscribe(before => {
        let beforePlayer = <Player> before;
        let oldName = beforePlayer.playerName;
        beforePlayer.playerName = "test2";
        service.updatePlayer(beforePlayer).subscribe(() => {
          service.getPlayer(beforePlayer.playerId).subscribe(after => {
            let afterPlayer = <Player> after;
            console.log("Player before: ");
            console.log(JSON.stringify(beforePlayer));
            console.log("Player after: ");
            console.log(JSON.stringify(afterPlayer));
            expect(afterPlayer.playerName !== oldName).toBeTruthy();
            expect(afterPlayer.playerName === 'test2');
            accountsCreated.push(afterPlayer);
            done();
          })
        });
      });
    }); 

  });

  it ('Should allow you to login after creating an account', (done) => {
    const service: ApiService = TestBed.get(ApiService);
    let login = Date.now().toString();
    service.createPlayer(login, login, 'test').subscribe(result => {
      let res: any = result;
      if (res.valid) {
        service.login(login, 'test').subscribe(loginRes => {
          let lRes: any = loginRes;
          accountsCreated.push(lRes.player);
          expect(lRes.valid).toBe(true);
          done();
        });
      }
    });
  })


});
