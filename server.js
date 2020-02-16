//Set up the server
const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./server/database")
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const game = require('./server/gameLogic/game');
//for generating uuids
const crypto = require("crypto");

const dbConnection = "mongodb+srv://sam:password.0@coursework-p9otl.mongodb.net/test?retryWrites=true&w=majority"
const port = process.env.PORT || 9000;

//Locate the build folder of the angular app
const angularApp = __dirname + '/dist/soft356scrabble/';
//We want to use our angular app
app.use(express.static(angularApp));

//We want to use cors just so when we're testing locally
//we can talk to ourself
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Required to hose the angular app within the server
app.get('/', (req, res) => {
    res.sendFile(angularApp + 'index.html');
})

//define some settings for connecting to mongo
const mongodbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

//Create app and listen on port
let server = app.listen(port, () => {
    console.log(`listening on port ${port}!`);
    mongoose.set('useFindAndModify', false);

    mongoose.connect(dbConnection, mongodbOptions).then((test) => {
        console.log("Connected to DB");
    });
    
});

//Initialise socket io
let io = require('socket.io').listen(server);

//Variables for keeping track of rooms and players,
//can be replaced by db eventually
const rooms = [];

//Post request for creating a player
//if a player doesn't already exist with the same login name
//the player object is sent back with a status code of 201
//otherwise a 409 is created as there was a conflict
app.post("/createPlayer", (req, res) => {
    var player = req.body;
    player.words = [];
    db.getPlayerViaLogin(player.loginName).then(p => {
        if (p != null) {
            res.send({ valid: false, reason: 'player with login already exists' })
        } else {
            db.createPlayer(player).then(res.send({ player: player, valid: true }));
        }
    });

});

//This post request is used for checking if login detals are correct
//a username and a hash is exchanged and checked against what is stored
//if everything matches then the user has succesfully logged in
app.post('/login', (req, res) => {
    var player = req.body;
    db.getPlayerViaLogin(player.loginName).then(fromDb => {
        let response = {};
        if (fromDb) {
            response.valid = player.password === fromDb.password;
            if (response.valid) {
                response.player = fromDb;
            }

        } else {
            response.valid = false;
        }

        res.send(response);

    });
});

//Find a player based on an id
app.get('/getPlayer/:id', (req, res) => {
    db.getPlayer(req.params.id).then(val => {
        res.send(val);
    });
});

//get a list of all players
app.get('/getPlayers', (req, res) => {
    db.getPlayers().then(val => {
        res.send(val);
    });
});

//COunt how many players are stored in the db
app.get('/getPlayerCount', (req, res) => {
    db.getPlayerCount().then(val => {
        res.send(val);
    });
});

//delete a player
app.delete('/deletePlayer/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(val => {
        res.send(val);
    });
});

//update a player
app.post('/updatePlayer', (req, res) => {
    db.updatePlayer(req.body).then(() => {
        res.statusCode = 201;
        res.send();
    })
});

//Create and reconstruct a game from it's turns stored within
//the database
app.get('/getGame/:roomid', (req, res) => {
    db.getFinishedGame(req.params.roomid).then(fromDb => {
        //We want to find the game and clone it
        let room = JSON.parse(JSON.stringify(fromDb));
        //if we have a room we want to recreate the objects inside it
        //as the database was used to store json strings
        if (room) {
            let players = JSON.parse(JSON.stringify(room.players));
            room.players = [];

            //recreate the players
            for (let i = 0; i < fromDb.players.length; i++) {
                room.players.push(JSON.parse(fromDb.players[i]));
            }

            //recreate the game
            room.game = JSON.parse(fromDb.game);
            //reconstruct the board for viewing end state
            game.recreateBoard(room.game);
            res.send(room);
        } else {
            res.send(false);
        }
    });
})

//Create a preiodic function call to check the state of rooms
//if they are empty (and older than a minute) or if the game has ended
//then we want to clean them out
setInterval(() => {
    for (let i = rooms.length; i >= 0; i--) {
        let room = rooms[i];
        if (room) {
            //If the room is empty and it is older than a minute then remove it
            //if the game has finished then remove it too
            if ((room.players.length == 0 && ((new Date().getTime() - new Date(room.createDate).getTime()) > 1000 * 60 * 1)) || (room.game && room.game.state === 'end')) {
                rooms.splice(i, 1);
            }
        }

    }
    io.emit('rooms', rooms);
}, 6000);

//we want to enable cors for testing
io.set('origins', '*:*');

//Set up socket.io
io.on('connection', socket => {

    //local variable for player
    let player = {};

    //Update room method to update clients on what rooms are 
    //available
    function updateRooms() {
        let toSend = JSON.parse(JSON.stringify(rooms));
        toSend.forEach(room => {
            delete room.game;
        })
        io.emit('rooms', rooms);
    }

    //Function used to send the current state of a game to the client
    function updateGame(room) {

        //We want to notify each player
        for (let i = 0; i < room.game.players.length; i++) {
            let clientInfo = JSON.parse(JSON.stringify(room.game));

            clientInfo.hand = clientInfo.players.filter(p => p.playerId === room.players[i].playerId)[0].hand;

            //remove any sensitive info
            for (let j = 0; j < clientInfo.players.length; j++) {
                delete clientInfo.players[j].hand;
            }

            //anything not needed to reduce in packet size
            delete clientInfo.dictionary;
            delete clientInfo.def;
            delete clientInfo.pool;
            delete clientInfo.firstTurn;
            delete clientInfo.handSize;

            clientInfo.yourTurn = (clientInfo.activePlayer === room.game.players[i].playerId);

            io.to(room.players[i].socketId).emit('setup', clientInfo);

        }
    }

    //function for dealing with game over
    function gameOver(room) {
        io.to(room.roomId).emit('Game Over', '');

        //determine the winner
        let winner = room.players[0];
        for (let i = 0; i < room.players.length; i++) {
            if (winner.score < room.players[i].score) {
                winner = room.players[i];
            }
        }

        //store it in the db
        storeGame(room);

        //append onto the players match history
        for (let i = 0; i < room.players.length; i++) {
            db.addGameToHistory(room.players[i].playerId, room.id);
        }

        //notify clients
        let message = 'Player: ' + winner.playerName + ' has won with a score of: ' + winner.score
        io.to(room.id).emit('message', { from: 'Server', contents: message });
        io.to(room.id).emit('notification', { type: 'success', text: message });
    }

    //process the game into something storable into the database 
    //with a small footprint
    function storeGame(room) {
        let toStore = JSON.parse(JSON.stringify(room));
        toStore.game = game.createDBstorableGame(room.game);
        delete toStore.messages;
        let players = JSON.parse(JSON.stringify(toStore.players));
        toStore.players = [];
        for (let i = 0; i < players.length; i++) {
            toStore.players.push(JSON.stringify(players[i]));
        }
        toStore.game = JSON.stringify(toStore.game);

        db.createFinishedGame(toStore);
    }

    //function for dealing with leaving rooms 
    function leave() {
        if (player.activeRoom) {
            //find the active room
            let room = rooms.find(o => {
                return o.id == player.activeRoom;
            });

            //if we have a room we want to leave it and remove ourselves from the player list
            if (room) {
                room.players = room.players.filter(p => p.playerId !== player.playerId);
                socket.leave(player.activeRoom);

                if (room.game) {
                    room.game.players = room.game.players.filter(p => p.playerId !== player.playerId);
                }

                io.to(room.id).emit('notification', { type: 'warning', text: 'Player: ' + player.playerName + ' has left.' });

            }

            player.activeRoom = null;

        }

        updateRooms();
    }

    //sanitise a player to be stored or sent
    function sanitisePlayer(player) {
        let toReturn = JSON.parse(JSON.stringify(player));
        delete toReturn.password;
        delete toReturn.loginName;
        delete toReturn._id;
        delete toReturn.__v;
        return toReturn;
    }


    //When we recieve this, we want to create a room for players to join
    socket.on('createRoom', room => {
        room.messages = [];
        room.createDate = new Date();
        
        //The id the client sends us will actually be the room 
        //name instead
        room.name = '' + room.id;
        //then we want to generate a uuid for the room id
        room.id = crypto.randomBytes(16).toString('hex');
        rooms.push(room)
        updateRooms();
    });

    //When we join a room we want to be able to leave one if we're in one
    //then find the room and join if all conditions are met
    socket.on('joinRoom', roomId => {
        leave();

        let room = rooms.find(o => {
            return o.id == roomId;
        });

        console.log(room);

        //if we're in the room already then we shouldn't join it again
        //if we''re trying to join a room when we're already in one then we shouldn't
        //if we've hit the max number of players then we shouldn't join
        //if the game has started we shouldn't join
        if (room.players.filter(p => p.socketId === socket.id).length > 0 || (room.players.filter(p => p.playerId === player.playerId).length > 0)) {
            socket.emit('notification', { type: 'warning', text: 'You are already in this room' });
        } else if (player.activeRoom != null) {
            socket.emit('notification', { type: 'warning', text: 'You are already in a room' });
        } else if (room.players.length == room.maxPlayers) {
            socket.emit('notification', { type: 'warning', text: 'Room is full' });
        } else if (room.game && room.game.state === 'active') {
            socket.emit('notification', { type: 'warning', text: 'You are unable to join a game that has already started' });
        } else {
            let toPush = sanitisePlayer(player);
            room.players.push(toPush);
            player.activeRoom = roomId;
            socket.join(roomId);
            updateRooms();
            socket.emit('joinSuccess', player);
            io.to(roomId).emit('notification', { type: 'success', text: 'Player: ' + player.playerName + ' has joined.' });
        }

    });

    //When we recieve this we should start the game for the room
    socket.on('startGame', roomId => {
        //find the room and start the game
        let room = rooms.find(o => o.id === roomId);
        room.game = game.initialSetup(room.players, 8);
        try {
            //let everyone know
            updateGame(room);
            io.to(player.activeRoom).emit('notification', { type: 'success', text: 'Game Started' });
        } catch (err) {
            console.log(err);
        }
    });

    //on make move notification
    socket.on('makeMove', moveReq => {
        //we want to find the room the move is for
        let room = rooms.find(r => r.id == moveReq.roomId);
        if (room) {
            //we want to attempt to make the move
            let res = game.makeMove(room.game, moveReq);
            //find the player who made the move
            let toBroadcast = room.game.players.find(player => player.playerId === moveReq.from);

            //if there is a valid move we want to send a notificaiton to every player int he game
            //if it isn't then we just want to tell the player who attempted to make the move
            //why it failed
            if (res.valid) {
                game.changeTurn(room.game);
                let message = { contents: '', from: "Server" };
                if (moveReq.moveType === 'playTile') {
                    message.contents = 'Player: ' + toBroadcast.playerName + " has played: " + res.words.join(', ') + " to score: " + res.score + " points.";
                } else if (moveReq.moveType === 'pass') {
                    message.contents = 'Player: ' + toBroadcast.playerName + ' has passed their turn.';
                } else if (moveReq.moveType === 'exchange') {
                    message.contents = 'Player: ' + toBroadcast.playerName + ' has exchanged tiles.';
                }

                io.to(moveReq.roomId).emit('notification', { type: 'success', text: message.contents });
                io.to(moveReq.roomId).emit('message', message);
                game.determineEnd(room.game);
            } else {
                socket.emit('notification', { type: 'warning', text: res.reason });
            }

            //after a move is made, check if the game should end
            if (room.game.state === 'end') {
                gameOver(room);
            }

            updateGame(room);
        } else {
            socket.emit('notification', { type: 'danger', text: 'Unable to find room to make move' });
        }

    });

    //on leave room notification
    socket.on('leaveRoom', any => {
        leave();
    });

    //On message room
    socket.on('messageRoom', message => {
        //As long as there's a message to actually send
        if (message.contents.length > 0) {
            //send to everyone in the room
            socket.to(player.activeRoom).emit('message', message);
        }
    })

    //on setplayer we want to set the local player variable on the socket
    socket.on('setPlayer', toSet => {
        toSet.socketId = socket.id;
        toSet.score = 0;
        player = toSet;
        db.updatePlayer(toSet);
        socket.emit('rooms', rooms);
    })

    //Once we connect we want to get a list of all rooms
    updateRooms();

    //every time a socket connects we want to log it just 
    //to keep track
    console.log('Socket' + socket.id + 'has connected');
  	
    socket.on('pong', pong => {
	console.log('pong');
    });
	
    setInterval(() => {
        console.log('ping');
	socket.emit('ping', 'ping');
    }, 30000);

});

