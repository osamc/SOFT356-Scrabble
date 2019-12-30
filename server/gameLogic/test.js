var assert = require('chai').assert;
var expect = require('chai').expect;

var game = require('./game');


describe('Game Logic Test', () => {

    it('The game should be able to produce default pool options', (done) => {
        console.log('creating default pool options');
        let options = game.createPoolOptions();
        expect(options.zValue).equal(10);
        expect(options.fValue).equal(4);
        done();
    });

    it('The game should be able to generate a tile pool based on default options', (done) => {
        console.log('creating default tile pool');
        let pool = game.generatePool(game.createPoolOptions()); 
        expect(pool.length).equal(99);
        expect(pool[0].letter).equal('a');
        done();
    });

    it('The game should be able to shuffle a group of tiles', (done) => {
        console.log('creating default pool');
        let pool = game.generatePool(game.createPoolOptions());
        console.log('shuffling said pool');
        //We use parse and stringify to clone an item
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
        
        console.log('Created hand:');
        console.log(JSON.stringify(hand));
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
        let players = [1,2,3];
        let setup = game.initialSetup(players, 8);

        expect(setup.players.length).equal(players.length);
        expect(setup.hands.length).equal(players.length);
        expect(setup.pool.length).equal((99 - 24));
        done();
    });

    it('The game shoud allow you to check if a tile placement valid is correct', (done) => {
        let players = [1,2,3];
        let setup = game.initialSetup(players, 8);

        //Initially the square is empty so you should be able to
        let success = game.checkPlacement(setup, setup.hands[0], 0,0);
        game.placeTile(setup, setup.hands[0], 0,0);
        expect(success).equal(true);

        //then as it's got something in the place it shouldn't be valid
        success = game.checkPlacement(setup, setup.hands[0], 0,0);
        expect(success).equal(false);

        done();
    });

    it('The game should allow you to place a tile', (done) => {
        let players = [1,2];
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
        let players = [1,2];
        let setup = game.initialSetup(players, 8);

        let tiles = [];
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});
        tiles.push({letter: 'e', value: 3});

        let moves = [];
        moves.push({x: 7, y: 7});
        moves.push({x: 8, y: 7});
        moves.push({x: 9, y: 7});
        moves.push({x: 10, y: 7});

        let isValid = game.checkMove(setup, tiles, moves);

        expect(isValid).equal(true)

        moves = [];
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
        let players = [1,2];
        let setup = game.initialSetup(players, 8);

        let tiles = [ {letter: 'l', value: 1},  {letter: 'a', value: 1},  {letter: 'm', value: 3},  {letter: 'b', value: 3},  {letter: 's', value: 1}];
        let moves = [ {x: 11, y:3}, {x: 11, y:4}, {x: 11, y:5}, {x: 11, y:6}, {x: 11, y:7}];

        let words = game.findWords(setup, tiles, moves);
        let strings = game.convertTilesToStrings(words);

        expect(strings[0]).equal('lambs');

        done();
    });

    it('The game should be able to find multiple words if tiles already exist', (done) => {
        let players = [1,2];
        let setup = game.initialSetup(players, 8);

        game.placeTile(setup, {letter: 'm', value: 3}, 7, 7);
        game.placeTile(setup, {letter: 'a', value: 1}, 8, 7);
        game.placeTile(setup, {letter: 's', value: 1}, 9, 7);
        game.placeTile(setup, {letter: 'k', value: 5}, 10, 7);

        let tiles = [ {letter: 'l', value: 1},  {letter: 'a', value: 1},  {letter: 'm', value: 3},  {letter: 'b', value: 3},  {letter: 's', value: 1}];
        let moves = [ {x: 11, y:3}, {x: 11, y:4}, {x: 11, y:5}, {x: 11, y:6}, {x: 11, y:7}];

        let words = game.findWords(setup, tiles, moves);
        let strings = game.convertTilesToStrings(words);

        expect(strings.includes('lambs')).equal(true);
        expect(strings.includes('masks')).equal(true);
        done();

    });

    it('The game should be able to determine the score of a word', (done) => {
        let players = [1,2];
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
        let players = [1,2];
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

        let score = game.determineScore(words);

        expect(score).equal(32);
        done();


    })




})