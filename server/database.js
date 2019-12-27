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

 module.exports.getPlayer = getPlayer;
 module.exports.getPlayers = getPlayers;
 module.exports.getPlayerCount = getPlayerCount;
 module.exports.createPlayer = createPlayer;
 module.exports.deletePlayer = deletePlayer;