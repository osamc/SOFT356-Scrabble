
//Function used to generate pool
function generatePool(poolOptions) {

    let tilePool = [];

    for(let i = 0; i < 26; i++) {
        let letter = (i + 10).toString(36);
        let letterCount = poolOptions[letter + 'Count'];
        let letterValue = poolOptions[letter + 'Value'];
        
        for(let j = 0; j < letterCount; j++) {
          tilePool.push({'letter': letter, value: letterValue});
        }
        
    }

    return tilePool;

}

//Shuffle a group of tiles
function shuffleTiles(tileGroup) {
    return tileGroup.sort(() => Math.random() - 0.5);
}

//deals a hand
function dealHand(handSize, pool) {
    let hand =  [];

    for(let i = 0; i < handSize; i++) {
        hand.push(pool.pop());
    }

    return hand;

}

function drawTiles(pool, hand, handSize) {
    let numberOfTiles = handSize - hand.length;
    for(let i = 0; i < numberOfTiles; i++) {
        hand.push(pool.pop());
    }
    return hand;
}

//Function used to define the default pool options
function createPoolOptions() {
    let poolOptions = {
        aCount: 9,
        aValue: 1,
    
        bCount: 2,
        bValue: 3,
    
        cCount: 2,
        cValue: 3,
    
        dCount: 4,
        dValue: 2,
    
        eCount: 12,
        eValue: 1,
    
        fCount: 2,
        fValue: 4,
    
        gCount: 3,
        gValue: 2,
    
        hCount: 2,
        hValue: 4,
    
        iCount: 9,
        iValue: 1,
    
        jCount: 1,
        jValue: 8,
    
        kCount: 1,
        kValue: 5,
    
        lCount: 4,
        lValue: 1,
    
        mCount: 2,
        mValue: 3,
    
        nCount: 6,
        nValue: 1,
    
        oCount: 8,
        oValue: 1,
    
        pCount: 2,
        pCount: 3,
    
        qCount: 1,
        qValue: 1,
    
        rCount: 6,
        rValue: 1,
    
        sCount: 4,
        sValue: 1,
    
        tCount: 6,
        tValue: 1,
    
        uCount: 4,
        uValue: 1,
    
        vCount: 2,
        vValue: 4,
    
        wCount: 2,
        wValue: 4,
    
        xCount: 1,
        xValue: 8,
    
        yCount: 2,
        yValue: 4,
    
        zCount: 1,
        zValue: 10,
    };

    return poolOptions
}

//create the board
function createBoard() {
	//Define the board array
    let board = [];
	//define the size
    let boardSize = 15;
    
	//Define the tiles
    let wordx2 = {type: 'word', multiplier: 2, tile: {}, used: false};
    let wordx3 = {type: 'word', multiplier: 3, tile: {}, used: false};

    let letterx2 = {type: 'letter', multiplier: 2, tile: {}, used: false};
    let letterx3 = {type: 'letter', multiplier: 3, tile: {}, used: false};

    let normal = {type: 'none', multiplier: 0, tile: {}, used: false};
    let centre = {type: 'centre', multiplier: 2, tile: {}, used: false};

	//Create board
    for(let i = 0; i < boardSize; i++) {
        //Create a row
        let row = [];

        for(let j = 0; j < boardSize; j++) {
            if((i == 0 || i == 14) && (j == 0 || j == 7 || j == 14) 
            || i == 7 && (j == 0 || j == 14)) {
                row.push(JSON.parse(JSON.stringify(wordx3)));
            } else if ((i == 1 || i == 13) && (j == 1 || j == 13)
            || (i == 2 || i == 12) && (j == 2 || j == 12)
            || (i == 3 || i == 11) && (j == 3 || j == 11) 
            || (i == 4 || i == 10) && (j == 4 || j == 10)) {
                row.push(JSON.parse(JSON.stringify(wordx2)));
            } else if ((i == 0 || i == 14)&& (j == 3 || j == 11)
            || (i == 2 || i == 12) && (j == 6 || j == 8)
            || (i == 3 || i == 11) && (j == 0 || j == 7 || j == 14)
            || (i == 6 || i == 8) && (j == 2 || j == 6 || j == 8 || j == 12)
            || i == 7 && (j == 3 || j == 11)) {
                row.push(JSON.parse(JSON.stringify(letterx2)));
            } else if ((i == 1 || i == 13) && (j == 5 || j == 9)
            || (i == 5 || i == 9) && (j == 1 || j == 5 || j == 9 || j == 13)) {
                row.push(JSON.parse(JSON.stringify(letterx3)));
            } else if (i == 7 && j == 7) {
                row.push(JSON.parse(JSON.stringify(centre)));
            } else {
                row.push(JSON.parse(JSON.stringify(normal)));
            }
        }

        board.push(row);
    }

    return board;
}

function initialSetup(players, handSize) {
    let game = {};

    let options = createPoolOptions();
    let pool = generatePool(options);
    shuffleTiles(pool);

    let hands = [];

    players.forEach(player => {
        let hand = dealHand(handSize, pool);
        hands.push(hand);
    });

    let board = createBoard();

    game.players = players;
    game.hands = hands;
    game.board = board;
    game.pool = pool;
    game.activePlayer = 0;
    game.firstTurn = true;
    game.handSize = handSize;

    return game;
}

function placeTile(game, tile, x, y)  {
    if (checkPlacement(game, tile, x, y)) {
        game.board[y][x].tile = tile;
    }
}

function playTile(game, tile, x ,y) {
    placeTile(game, tile, x, y);
    game.board[y][x].used = true;
}

function checkPlacement(game, tile, x ,y) {
    // If the tile in the board is an empty object, then it's free
    if (JSON.stringify(game.board[y][x].tile) == '{}') {
        return true;
    } else {
        return false;
    }
}

function checkIfTileExists(boardTile) {
    return JSON.stringify(boardTile.tile) != '{}';
}

function checkMove(game, tiles, moves) {
    //clone the game
    let newGame = JSON.parse(JSON.stringify(game));

    //if it's the first turn, the centre
    //square must be used
    if(game.firstTurn) {
        let centreUsed = false;

        for(let i = 0; i < moves.length; i++) {
            if (moves[i].x == 7 && moves[i].y == 7) {
                centreUsed = true;
            }
        }

        if (!centreUsed) {
            return false
        }
    }


    //We should check to see if positions are placeable
    for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        let move = moves[i];

        if (!checkPlacement(newGame, tile, move.x, move.y)) {
            return false;
        } 
        
    }
   
    //Check to see if moves are in a single line
    var xVals = [];
    var yVals = [];

    //Collect all x and y values
    for(let i = 0; i < moves.length; i++) {
        xVals.push(moves[i].x);
        yVals.push(moves[i].y);
    }


    //If the size of both is not one, then we have tiles
    //not placed in a horizontal or vertical line
    if (new Set(xVals).size != 1 && new Set(yVals).size != 1) {
        return false;
    }

    let moveIsVertical = (new Set(xVals).size == 1);
    

    if (moveIsVertical) {
        yVals.sort(function(a, b){return a - b});

        for(let i = 1; i < yVals.length; i++) {
            if(yVals[i] - yVals[i - 1] != 1) {
                let missingVal = yVals[i] - 1;
                if (!checkIfTileExists(newGame.board[missingVal][xVals[0]])) {
                    return false;
                }
            }
        }

    } else {
        xVals.sort(function(a, b){return a - b});
        for(let i = 1; i < xVals.length; i++) {
            if(xVals[i] - xVals[i - 1] != 1) {
                let missingVal = xVals[i] - 1;
                if (!checkIfTileExists(newGame.board[yVals[0]][missingVal])) {
                    return false;
                }
            }
        }
    }

    //If we get to here, then we want to place the tiles and make
    //sure that it has joined on to something
    for(let i = 0; i < moves.length; i++){
        placeTile(newGame, tiles[i], moves[i].x, moves[i].y);
    }

    let validMove = true;

    //Check that everything has atleast 1 adjacent tile
    for (let i = 0; i < newGame.board.length; i++) {
        for (let j = 0; j < newGame.board[0].length; j++) {
            if (JSON.stringify(game.board[j][i].tile) != '{}') {

                let toCheck = [];
                //up
                toCheck.push({x : i, y: j + 1});
                //down
                toCheck.push({x : i, y: j - 1});
                //left
                toCheck.push({x : i - 1, y: j});
                //right
                toCheck.push({x : i + 1, y: j});

                //Check to make sure all positions are posible tile positions
                for (let k = toCheck.length - 1; k >= 0; k--) {
                    if (toCheck[k].x < 0 || toCheck[k].x == 15 
                        || toCheck[k].y < 0 || toCheck[k].y == 15) {
                            toCheck.splice(k, 1);
                    } 
                }


                let validPosition = false;

                for(let k = 0; k < toCheck.length; k++) {

                    validPosition = checkIfTileExists(newGame.board[toCheck[k].y][toCheck[k].x]);
                    
                    if (validPosition) {
                        break;
                    }
                }

                if (!validPosition) {
                    validMove = false;
                }

            }

            if (!validMove) {
                break;
            }

        }
        if (!validMove) {
            break;
        }
    }

    return validMove;

}

function determineIfMoveIsVertical(moves) {
   
    //Check to see if moves are in a single line
    var xVals = [];
    var yVals = [];

    //Collect all x and y values
    for(let i = 0; i < moves.length; i++) {
        xVals.push(moves[i].x);
        yVals.push(moves[i].y);
    }

    return (new Set(xVals).size == 1);
}

function findWords(game, tiles, moves) {

    let foundWords = [];

    let isVertical = determineIfMoveIsVertical(moves);

    let newGame = JSON.parse(JSON.stringify(game));
    for(let i = 0; i < moves.length; i++){
        placeTile(newGame, tiles[i], moves[i].x, moves[i].y);
    }

    let mainCheck = isVertical ? findWordsVert : findWordsHoriz;
    let subsCheck = isVertical ? findWordsHoriz : findWordsVert;

    let mainWord = mainCheck(newGame, moves[0]);
    foundWords.push(mainWord);

    for(let i = 1; i < moves.length; i++) {
        let subWord = subsCheck(newGame, moves[i]);
        if (subWord.length > 1) {
            foundWords.push(subWord);
        }
        
    }

    return foundWords;

}

function findWordsVert(game, pos) {
    let topMost = pos.y;

    while ((topMost - 1) == 0 || checkIfTileExists(game.board[topMost - 1][pos.x])) {
        topMost--;
    } 

    let word = [];

    while((topMost + 1) == 15 || checkIfTileExists(game.board[topMost][pos.x])) {
        word.push(cloneObject(game.board[topMost][pos.x]));
        topMost++;
    }

    return word;

}

function findWordsHoriz(game, pos) {
    let leftMost = pos.x;

    while ((leftMost - 1) == 0 || checkIfTileExists(game.board[pos.y][leftMost - 1])) {
        leftMost--;
    } 

    let word = [];

    while((leftMost + 1) == 15 || checkIfTileExists(game.board[pos.y][leftMost])) {
        word.push(cloneObject(game.board[pos.y][leftMost]));
        leftMost++;
    }

    return word;
}

function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function getStringFromTiles(tiles) {
    let word = "";

    for (let i = 0; i < tiles.length; i++) {
        word += tiles[i].tile.letter;
    }

    return word;
}

function convertTilesToStrings(tilesArr) {
    let words = [];
    for(let i = 0; i < tilesArr.length; i++) {
        words.push(getStringFromTiles(tilesArr[i]));
    }
    return words;
}


function determineScore(words) {

    let score = 0;

    for(let i = 0; i < words.length; i++) {

        let wordMulti = 1;
        let wordScore = 0;

        for(let c = 0; c < words[i].length; c++) {
            let boardTile = words[i][c];
			let letterMulti = 1;
			
            if (!boardTile.used) {
                switch (boardTile.type) {
                    case "centre":
                    case "word":
                        wordMulti *= boardTile.multiplier;
                        break;
                    case "letter":
                        letterMulti *= boardTile.multiplier;
                        break;
                    case "none":
                    default:
                        break;
    
                };
				wordScore += (letterMulti * boardTile.tile.value);
            } else {
                wordScore += boardTile.tile.value;
            }
        };

        score += (wordMulti * wordScore);

    }

    return score;

}


function makeMove(game, moveRequest) {
    
    let tiles = moveRequest.tiles;
    let moves = moveRequest.moves;

    let moveRes = {};
    moveRes.score = 0;
    moveRes.words = [];
    moveRes.valid = false;

    if(checkMove(game, tiles, moves)) {
        moveRes.words = findWords(game, tiles, moves);
        moveRes.score = determineScore(words);

        //check words exist

        moveRes.valid = true;
    }

    if (moveRes.valid) {
        for(let i = 0; i < tiles.length; i++) {
            playTile(setup, tiles[i], moves[i].x, moves[i].y);
        }

        let playerToUpdate = game.players.find(player => {
            player.playerId == game.activePlayer;
        });

        playerToUpdate.score += score;
        playerToUpdate.words.concat(words);

        drawTiles(game.pool, playerToUpdate.hand, game.handSize);
    
    }
    
    return moveRes;
 
}

module.exports.generatePool = generatePool;
module.exports.createPoolOptions = createPoolOptions;
module.exports.shuffleTiles = shuffleTiles;
module.exports.dealHand = dealHand;
module.exports.drawTiles = drawTiles;
module.exports.createBoard = createBoard;
module.exports.initialSetup = initialSetup;
module.exports.placeTile = placeTile;
module.exports.checkPlacement = checkPlacement;
module.exports.checkMove = checkMove;
module.exports.findWords = findWords;
module.exports.convertTilesToStrings = convertTilesToStrings;
module.exports.determineScore = determineScore;
module.exports.playTile = playTile;