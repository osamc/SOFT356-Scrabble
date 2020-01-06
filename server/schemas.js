const mongoose = require('mongoose');

var player = mongoose.model('player', {
    playerId: String,
    loginName: String,
    playerName: String,
    password: String,
    socketId: String,
    activeRoomId: String,
    gameHistory: [String]
});


var game = mongoose.model('game', {
    id: String,
    maxPlayers: Number,
    name: String,
    players: [String],
    createDate: String,
    game: String
});



module.exports.player = player;
module.exports.game = game; 