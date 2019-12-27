var schemas = require("./schemas");
var ObjectId = require('mongodb').ObjectId;

 async function getPlayer(id) {
     return await schemas.player.findOne({"playerId":id});
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
    var update = {playerName: player.playerName, 
    socketId: player.socketId,
    activeRoomId: player.activeRoomId};
    console.log(update);
    return await schemas.player.update({"playerId" : player.playerId}, update, {upsert: true} ,function(err, doc) {
        return doc;
    });
 }

 module.exports.getPlayer = getPlayer;
 module.exports.getPlayers = getPlayers;
 module.exports.getPlayerCount = getPlayerCount;
 module.exports.createPlayer = createPlayer;
 module.exports.deletePlayer = deletePlayer;
 module.exports.updatePlayer = updatePlayer;