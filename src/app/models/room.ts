import { Message } from './message';
import { Player } from './player';
import { Game } from './game';

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

    game?: Game;

}