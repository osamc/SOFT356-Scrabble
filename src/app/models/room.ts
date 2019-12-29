import { Message } from './message';
import { Player } from './player';
import { boardTile } from './game/boardTile';
import { letterTile } from './game/letterTile';

export enum GameState {
    STARTED,
    STARTING,
    ENDED,
    PENDING
}


export class Room {

    id:string;
    messages?: Message[] = [];
    maxPlayers?: Number = 8;
    players?: Player[] = [];
    gameState?: GameState;
    board?: boardTile[]
    tilePool?: letterTile[];
    gameHands?: {};

}