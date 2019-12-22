import { Message } from './message';
import { Player } from './player';

export class Room {

    id:string;
    messages?: Message[] = [];
    maxPlayers?: Number = 8;
    players?: Player[] = [];

}