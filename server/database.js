var schemas = require("./schemas");
var ObjectId = require('mongodb').ObjectId;

 async function getPlayer(id) {
     return await schemas.player.findOne({"playerId":id});
 }

 async function getPlayerViaLogin(id) {
     return await schemas.player.findOne({loginName: id});
 }

 async function deletePlayer(id) {
     return await schemas.player.deleteOne({"playerId": id});
 }

 async function createPlayer(player) {
    return await schemas.player.create(player);
 }

 async function getPlayers() {
     return await schemas.player.find();
 }

 async function getPlayerCount() {
     return await schemas.player.count();
 }

 async function updatePlayer(player) {
    var update = {
    socketId: player.socketId,
    activeRoomId: player.activeRoomId};
    return await schemas.player.update({"playerId" : player.playerId}, update, {upsert: true} ,function(err, doc) {
        return doc;
    });
 }

 async function createFinishedGame(room) {
     return await schemas.game.create(room);
 }

 async function getFinishedGame(toFind) {
    return await schemas.game.findOne({id:toFind});
 }

 async function addGameToHistory(player, gameId) {
   return await schemas.player.update({playerId: player}, {$push: {gameHistory: gameId}});
 }



 module.exports.getPlayer = getPlayer;
 module.exports.getPlayers = getPlayers;
 module.exports.getPlayerCount = getPlayerCount;
 module.exports.createPlayer = createPlayer;
 module.exports.deletePlayer = deletePlayer;
 module.exports.updatePlayer = updatePlayer;
 module.exports.getPlayerViaLogin = getPlayerViaLogin;
 module.exports.createFinishedGame = createFinishedGame;
 module.exports.getFinishedGame = getFinishedGame;
 module.exports.addGameToHistory = addGameToHistory;