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
    gameId: String,
    players: [String],
    turns : String
});



module.exports.player = player;
module.exports.game = game; 