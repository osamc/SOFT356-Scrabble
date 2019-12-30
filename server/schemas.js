const mongoose = require('mongoose');

var player = mongoose.model('player', {
    playerId: String,
    playerName: String,
    socketId: String,
    activeRoomId: String
});



var room = mongoose.model('room', {
    id: String,
    messages: [String],
    maxPlayers: Number,
    players: [String],
});



module.exports.player = player;
module.exports.room = room; 