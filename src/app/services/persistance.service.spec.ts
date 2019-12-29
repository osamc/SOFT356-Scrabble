import { TestBed } from '@angular/core/testing';

import { PersistanceService } from './persistance.service';
import { Player } from '../models/player';

describe('PersistanceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('Should be able to retrieve and store a player', (done) => {
    
    console.log("Test to see if players can be stored in storage");
    const service: PersistanceService = TestBed.get(PersistanceService);

    // Create player to be stored
    const player: Player = {playerId: 'test'};
    player.playerName = 'another';

    //Store the player
    service.storePlayer(player);

    //Retrieve it
    const playerFromStorage = service.retrievePlayer();

    console.log('Player we stored:');
    console.log(player);
    console.log('Player from storage:')
    console.log(playerFromStorage);

    //Expect that what we put in is the same as we get out
    expect(JSON.stringify(player)).toEqual(JSON.stringify(playerFromStorage));
    done();

  })



});
