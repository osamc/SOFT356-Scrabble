export class Game {

    players: any[];
    board: any[][];
    activePlayer: string;
    yourTurn: boolean;
    firstTurn: boolean;
    hand: GameTile[];
}


export class BoardTile {
    type: string;
    multiplier: number;
    tile: any;
    used: boolean;
}


export class GameTile {
    letter: string;
    value: number;
    selected?: boolean;
    used?: boolean;
    moveId?: number;
}