var assert = require('chai').assert;
var expect = require('chai').expect;

var game = require('./game');


describe('Game Logic Test', () => {

    it('The game should be able to produce default pool options', (done) => {
        console.log('creating default pool options');
        let options = game.createPoolOptions();
        //These are the standard values in a scrabble game
        expect(options.zValue).equal(10);
        expect(options.fValue).equal(4);
        done();
    });

    it('The game should be able to generate a tile pool based on default options', (done) => {
        console.log('creating default tile pool');
        let pool = game.generatePool(game.createPoolOptions()); 
        //We should have 98 tiles, in a standard game
        //there are 100 but we don't support blank tiles
        expect(pool.length).equal(98);
        expect(pool[0].letter).equal('a');
        done();
    });

    it('The game should be able to shuffle a group of tiles', (done) => {
        //creating pool
        let pool = game.generatePool(game.createPoolOptions());
        
        //Shuffling pool
        let shuffled = game.shuffleTiles(JSON.parse(JSON.stringify(pool)));

        expect(pool).not.equal(shuffled, "Pool and shuffled is the same");
        expect(pool.length).equal(shuffled.length, "The two arrays were not the same length");
        done();

    });

    it('The game should be able to deal a hand of X size', (done) => {
        console.log('Creating hand');
        let pool = game.generatePool(game.createPoolOptions());
       
        let poolSize = pool.length;
        let handSize = 7;

        let hand = game.dealHand(handSize, pool);

        expect(poolSize - handSize).equal(pool.length);
        expect(hand.length).equal(handSize);
        
        done();
    });

    it('The game should be able to allow the player draw X number of tile', (done) => {
        let pool = game.generatePool(game.createPoolOptions());
        let handSize = 8;

        let hand = game.dealHand(handSize, pool);

        let poolSize = pool.length;
        let discardCount = Math.floor(Math.random() * 9);
        console.log("Discarding: " + discardCount);

        //If we just remove the tiles from the hand, we can simulate placing them for now
        for(let i = 0; i < discardCount; i++) {
            hand.pop();
        }

        console.log(JSON.stringify(hand));

        console.log("hand size was " + handSize + " now is:" + hand.length);

        game.drawTiles(pool, hand, handSize);

        console.log("hand after drawing  tiles");
        console.log(JSON.stringify(hand));

        expect(hand.length).equal(8);
        expect(pool.length).equal(poolSize - discardCount);
        done();
    });

    it('The game should be able to create the game board', (done) => {

        let board = game.createBoard();

        //The standard scrabble board is 15x15
        //so check x
        expect(board.length).equal(15);
        //check y
        expect(board[0].length).equal(15);

        expect(board[0][0].type).equal('word');
        expect(board[0][0].multiplier).equal(3);
        expect(board[1][1].type).equal('word');
        expect(board[1][1].multiplier).equal(2);
        expect(board[5][1].type).equal('letter');
        expect(board[5][1].multiplier).equal(3);
        expect(board[7][7].type).equal('centre');
        expect(board[7][7].multiplier).equal(2);

        done();
    });

    it('The game should be able to be setup', (done) => {
        let players = [{hand: {}, id: 'i'}, {hand: {}, id: 'j'}, {hand: {}, id: 'k'}];
        let setup = game.initialSetup(players, 8);

        expect(setup.players.length).equal(players.length);
        expect(setup.players[0].hand.length).equal(8);
        expect(setup.pool.length).equal((98 - 24));
        done();
    });

    it('The game shoud allow you to check if a tile placement valid is correct', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        //Initially the square is empty so you should be able to
        let success = game.checkPlacement(setup, setup.players[0].hand[0], 0,0);
        game.placeTile(setup, setup.players[0].hand[0], 0,0);
        expect(success).equal(true);

        //then as it's got something in the place it shouldn't be valid
        success = game.checkPlacement(setup, setup.players[0].hand[0], 0,0);
        expect(success).equal(false);

        done();
    });

    it('The game should allow you to place a tile', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        game.placeTile(setup, {letter: 'e', value: 3}, 0,0);

        let affectedTiles = 0;

        for(let i = 0; i < setup.board.length; i++) {
            for(let j = 0; j < setup.board[0].length; j++) {
                if (JSON.stringify(setup.board[i][j].tile) != '{}') {
                    affectedTiles++;
                }
            }
        }

        expect(affectedTiles).equal(1);

        done();

    })

    it('The game should be able to check if a move is valid (tile placement wise)', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});

        //This move is valid as these are all in one line
        let moves = [];
        moves.push({x: 7, y: 7});
        moves.push({x: 8, y: 7});
        moves.push({x: 9, y: 7});
        moves.push({x: 10, y: 7});

        let isValid = game.checkMove(setup, tiles, moves);

        expect(isValid).equal(true)

        moves = [];

        //this is not as there would be a break
        moves.push({x: 7, y: 7});
        moves.push({x: 9, y: 7});
        moves.push({x: 10, y: 7});
        moves.push({x: 11, y: 7});

        isValid = game.checkMove(setup, tiles, moves);
        expect(isValid).equal(false);

        game.placeTile(setup, {letter: 'e', value: 3}, 8,7);
        isValid = game.checkMove(setup, tiles, moves);
        expect(isValid).equal(true);

        done();

    });

    it('The game should be able to find a word if placed on board', (done) =>{
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        //This set of tiles and moves should create the word lambs
        let tiles = [ {letter: 'l', value: 1},  {letter: 'a', value: 1},  {letter: 'm', value: 3},  {letter: 'b', value: 3},  {letter: 's', value: 1}];
        let moves = [ {x: 11, y:3}, {x: 11, y:4}, {x: 11, y:5}, {x: 11, y:6}, {x: 11, y:7}];

        let words = game.findWords(setup, tiles, moves);
        let strings = game.convertTilesToStrings(words);

        expect(strings[0]).equal('lambs');

        done();
    });

    it('The game should be able to find multiple words if tiles already exist', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        game.placeTile(setup, {letter: 'm', value: 3}, 7, 7);
        game.placeTile(setup, {letter: 'a', value: 1}, 8, 7);
        game.placeTile(setup, {letter: 's', value: 1}, 9, 7);
        game.placeTile(setup, {letter: 'k', value: 5}, 10, 7);

        //after placing the tiles above, playing these tiles should result in both
        //words: lambs and masks
        let tiles = [ {letter: 'l', value: 1},  {letter: 'a', value: 1},  {letter: 'm', value: 3},  {letter: 'b', value: 3},  {letter: 's', value: 1}];
        let moves = [ {x: 11, y:3}, {x: 11, y:4}, {x: 11, y:5}, {x: 11, y:6}, {x: 11, y:7}];

        let words = game.findWords(setup, tiles, moves);
        let strings = game.convertTilesToStrings(words);

        expect(strings.includes('lambs')).equal(true);
        expect(strings.includes('masks')).equal(true);
        done();

    });

    it('The game should be able to determine the score of a word', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        let tiles = [ {letter: 'm', value: 3},  
            {letter: 'a', value: 1},  
            {letter: 's', value: 1},  
            {letter: 'k', value: 5}];

        let moves = [ {x: 7, y:7}, 
            {x: 7, y:8}, 
            {x: 7, y:9}, 
            {x: 7, y:10}];

        let words = game.findWords(setup, tiles, moves);

        let score = game.determineScore(words);

        //The sum of mask point wise is 10, 
        //however 7,7 (the centre) counts
        //as a double word
        expect(score).equal(20);

        done();
    });


    it('The game should be able to determine scores of multiple words', (done) => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        let tiles = [ {letter: 'm', value: 3},  
            {letter: 'a', value: 1},  
            {letter: 's', value: 1},  
            {letter: 'k', value: 5}];

        let moves = [ {x: 7, y:7}, 
            {x: 8, y:7}, 
            {x: 9, y:7}, 
            {x: 10, y:7}];

        for(let i = 0; i < tiles.length; i++) {
            game.playTile(setup, tiles[i], moves[i].x, moves[i].y);
        }

        tiles = [ {letter: 'l', value: 1},  {letter: 'a', value: 1},  {letter: 'm', value: 3},  {letter: 'b', value: 3},  {letter: 's', value: 1}];
        moves = [ {x: 11, y:3}, {x: 11, y:4}, {x: 11, y:5}, {x: 11, y:6}, {x: 11, y:7}];

        let words = game.findWords(setup, tiles, moves);

        console.log(game.convertTilesToStrings(words));

        //For this we have two seperate words, so we should get a combined
        //score for them both
        let score = game.determineScore(words);

        expect(score).equal(32);
        done();


    });

    it('The game should read in the dictionary correctly', () => {
        let dict = game.getDictionary();
        //should be that length
        expect(dict.length).equal(279496);
    });

    it('The game should be able to determine if words are valid', () => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);
        
        //Check if some words are in the dictionary
        expect(game.checkWordValidity(setup, 'test')).equal(true);
        expect(game.checkWordValidity(setup, 'tfest')).equal(false);
        expect(game.checkWordValidity(setup, 'dictionary')).equal(true);
        expect(game.checkWordValidity(setup, 'junittest')).equal(false);
    });

    it('The game should be able to allow moves to be made', () => {
        let players = [{hand: {}, playerId: 'i', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'test';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';


        let res = game.makeMove(setup, moveRequest);

        //The response of should contain the info from the move
        expect(res.valid).equal(true);
        expect(res.score).equal(8);
        expect(res.words[0]).equal('test');

    });

    it('The game should be able to emulate an actual game', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';


        let res = game.makeMove(setup, moveRequest);

        console.log(res);

        setup.activePlayer = '2';

        testWord = 'lambs';
        tiles = [];
        moves = [];
        
        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 11, y: 3 + i});
        }

        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';


        let res2 = game.makeMove(setup, moveRequest);

        console.log(res2);

        expect(setup.players[0].score).equal(20);
        expect(setup.players[0].words.length).equal(1);

        expect(setup.players[1].score).equal(32);
        expect(setup.players[1].words.length).equal(2);

    });

    it('The game should be able to change turn to the next player', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        expect(setup.activePlayer).equal('1');
        game.changeTurn(setup);
        expect(setup.activePlayer).equal('2');
        game.changeTurn(setup);
        expect(setup.activePlayer).equal('1');
    });

    it('The game should be able to rotate between 3 players', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []},   {hand: {}, playerId: '3', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        expect(setup.activePlayer).equal('1');
        game.changeTurn(setup);
        expect(setup.activePlayer).equal('2');
        game.changeTurn(setup);
        expect(setup.activePlayer).equal('3');
        game.changeTurn(setup);
        expect(setup.activePlayer).equal('1');
    });

    it('The game should allow for players to exchange tiles', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []},   {hand: {}, playerId: '3', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = JSON.parse(JSON.stringify(setup.players[0].hand));

        let poolSize = setup.pool.length;

        let player = setup.players[0];

        game.exchangeTiles(setup, tiles);
       
        //We expect the hand to be different, it's very unlikely we'll get the same 8 tiles
        expect(JSON.stringify(player.hand) != JSON.stringify(tiles)).equal(true); 
        expect(poolSize).equal(setup.pool.length);
        expect(player.hand.length).equal(setup.handSize);

    });

    it('The game should determine a move that has a different number of locations and tiles invalid', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []},   {hand: {}, playerId: '3', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7});
        }

        moves.pop();

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.moveType = 'playTile';


        let res = game.makeMove(setup, moveRequest);

    });

    it('The game should not be able to process move requests if they are not the active player', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = '2';
        moveRequest.moveType = 'playTile';


        let res = game.makeMove(setup, moveRequest);

        expect(res.valid).equal(false);
        expect(res.reason).equal('You are not the active player');

    });

    it('The game should remove tiles from the players hand once they\'re played', () => {
        let players = [{hand: {}, id: 'i'}];
        let setup = game.initialSetup(players, 8);

        let tiles = [ {letter: 'm', value: 3},  
            {letter: 'a', value: 1},  
            {letter: 's', value: 1},  
            {letter: 'k', value: 5}];

        let moves = [ {x: 7, y:7}, 
            {x: 8, y:7}, 
            {x: 9, y:7}, 
            {x: 10, y:7}];

        players[0].hand.length = 4;

        for(let i = 0; i < tiles.length; i++) {
            game.playTile(setup, tiles[i], moves[i].x, moves[i].y);
        }

        expect(setup.handSize == players[0].hand.length).equal(false);

    });

    it('The game should not allow moves that have diagonal placements', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7 + i});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';

        let res = game.makeMove(setup, moveRequest);

        expect(res.valid).equal(false);
    });

    it('The game should work if a player decides to play 1 letter', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        let moves = [];
        let testWord = 'wee';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7, y: 7 + i});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';


        let res = game.makeMove(setup, moveRequest);
        game.changeTurn(setup);

        tiles = [];
        moves = [];

        testWord = 'w';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 8, y: 9});
        }

        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';


        let res2 = game.makeMove(setup, moveRequest);
        console.log(res2);

        //THis is because we made the word ew
        expect(res.valid).equal(true);

    });

    it ('The game should not give out empty tiles when there are no tiles left', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);
        setup.pool.length = 2;
        players[0].hand.length = 2;

        console.log(JSON.stringify(setup.players[0]));
        console.log(setup.pool);

        game.drawTiles(setup.pool, players[0].hand, setup.handSize);

        console.log(JSON.stringify(players[0].hand));

        expect(players[0].hand.length).equal(4);

    });

    it ('The game shoud allow for tiles on the boarder extremes', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);
        setup.firstTurn = false;

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x:11 + i, y: 14});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';

        let res = game.makeMove(setup, moveRequest);

    });

    it ('The game shoud allow for tiles on the boarder minimums', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);
        setup.firstTurn = false;

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x:0, y: 0 + i});
        }

        let moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';

        let res = game.makeMove(setup, moveRequest);

    });

    it ('The game should end if a player passes two times in a row', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let moveRequest = {};
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'pass';

        let res = game.makeMove(setup, moveRequest);

        game.changeTurn(setup);
        moveRequest = {};
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'pass';

        res = game.makeMove(setup, moveRequest);
        
        game.changeTurn(setup);
        moveRequest = {};
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'pass';

        res = game.makeMove(setup, moveRequest);

        game.determineEnd(setup);

        expect(setup.state).equal('end');

    });

    it ('Should end the game if a player passes twice in a row more than 3 turns', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);

        let moveRequest = {};
        
        for(let i = 0; i < 10; i++) {

            game.changeTurn(setup);
            moveRequest = {};
            moveRequest.from = setup.activePlayer;
            moveRequest.moveType = 'pass';
    
            res = game.makeMove(setup, moveRequest);
        }

        game.changeTurn(setup);

        let tiles = [];
        let moves = [];
        let testWord = 'mask';

        for(let i = 0; i < testWord.length; i++) {
            tiles.push(getTile(game, testWord[i]));
            moves.push({x: 7 + i, y: 7});
        }

        moveRequest = {};
        moveRequest.moves = moves;
        moveRequest.tiles = tiles;
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'playTile';

        game.changeTurn(setup);
        game.makeMove(setup, moveRequest);

        moveRequest = {};
        moveRequest.from = setup.activePlayer;
        moveRequest.moveType = 'pass';

        game.makeMove(setup, moveRequest);

        game.determineEnd(setup);

        expect(setup.state).equal('end');
    });

    it ('The game should be able to recreate games from a set of turns', () => {
        let toTest = {};
        toTest.turns = JSON.parse('[{"moves":[{"x":7,"y":7,"moveId":0},{"x":8,"y":7,"moveId":1},{"x":9,"y":7,"moveId":2}],"tiles":[{"letter":"v","value":4,"selected":true,"moveId":0},{"letter":"a","value":1,"selected":true,"moveId":1},{"letter":"n","value":1,"selected":true,"moveId":2}],"roomId":"4b9c0568f01416f334cc8d5371850439","moveType":"playTile","from":"5b7c52fe-443e-44d1-9905-6e8e9f3e98e3"},{"roomId":"4b9c0568f01416f334cc8d5371850439","moveType":"pass","from":"5b7c52fe-443e-44d1-9905-6e8e9f3e98e3"},{"roomId":"4b9c0568f01416f334cc8d5371850439","moveType":"pass","from":"5b7c52fe-443e-44d1-9905-6e8e9f3e98e3"}]');
        game.recreateBoard(toTest);

        expect(toTest.board[7][7].tile.letter).equal('v');
    });

    it ('Should allow for words to be found on the extremes', () => {
        let players = [{hand: {}, playerId: '1', score: 0, words: []},
        {hand: {}, playerId: '2', score: 0, words: []}];
        let setup = game.initialSetup(players, 8);
        let testPhrase = 'quizzing';
        let tiles = [];
        let moves = [];
        for(let i = 0; i < testPhrase.length; i++) {
         tiles.push(getTile(game, testPhrase[i]));
         moves.push({x: 7, y: 7 + i})
        }

        let moveRequest = {};
        moveRequest.from = players[0].playerId;
        moveRequest.tiles = tiles;
        moveRequest.moves = moves;

        let res = game.makeMove(setup, moveRequest);

        expecet(res.valid).equal(true);

    })

    
});

function getTile(game, letter) {
    let options = game.createPoolOptions();
    return {letter: letter, value: options[letter + 'Value']}; 
}