const mongoose = require('mongoose');

var player = mongoose.model('player', {
    playerId: String,
    playerName: String,
    socketId: String,
    activeRoomId: String
});

const gameTile = class {
    constructor(letter, value) {
        this.letter = letter;
        this.value = value;
    }
}

var gameTile = mongoose.Schema('gameTile' , {
    letter: String,
    value: Number,
});

var hand = mongoose.Schema('hand', {
    id: String,
    hand: [gameTile]
})

var room = mongoose.model('room', {
    id: String,
    messages: [String],
    maxPlayers: Number,
    players: [String],
    tilePool: [gameTile],
    hands: [hand]
});



module.exports.player = player;
module.exports.room = room;