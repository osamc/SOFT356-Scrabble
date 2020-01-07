export class Game {
    players: any[];
    board: any[][];
    activePlayer: string;
    yourTurn: boolean;
    firstTurn: boolean;
    hand: GameTile[];
    state?: string;
    turns?: Turn[];
    parsedTurns?: string[];
}

export class Turn {
    moves?: any[];
    tiles?: any[];
    roomId: string;
    moveType: string;
    from: string;
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