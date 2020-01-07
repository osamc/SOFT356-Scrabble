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



const dbConnection = "mongodb+srv://sam:password.0@scrabble-hs60n.mongodb.net/scrabble?retryWrites=true&w=majority"
const port = process.env.PORT || 9000;

//Locate the build folder of the angular app
const angularApp = __dirname + '/dist/soft356scrabble/';
//We want to use our angular app
app.use(express.static(angularApp));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Example get request
app.get('/example', (req, res) => res.send('Hello World!'));

//Required to hose the angular app within the server
app.get('/', (req, res) => {
    res.sendFile(angularApp + 'index.html');
})

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

app.post("/createPlayer", (req, res) => {
    var player = req.body;
    player.words = [];
    db.getPlayerViaLogin(player.loginName).then(p => {
        if (p != null) {
            res.send({valid: false, reason: 'player with login already exists'})
        } else {
            db.createPlayer(player).then(res.send({player: player, valid: true}));
        }
    });
    
});

app.post('/login', (req, res) => {
    var player = req.body;
    db.getPlayerViaLogin(player.loginName).then(fromDb => {
        let response = {};
        response.valid = player.password === fromDb.password;
        if (response.valid) {
            response.player = fromDb;
        }
        res.send(response);
    });
});

app.get('/getPlayer/:id', (req, res) => {
    db.getPlayer(req.params.id).then(val => {
        res.send(val);
    });
});

app.get('/getPlayers', (req, res) => {
    db.getPlayers().then(val => {
        res.send(val);
    });
});

app.get('/getPlayerCount', (req, res) => {
    db.getPlayerCount().then(val => {
        res.send(val);
    });
});

app.delete('/deletePlayer/:id', (req, res) => {
    db.deletePlayer(req.params.id).then(val => {
        res.send(val);
    });
});

app.post('/updatePlayer', (req, res) => {
    db.updatePlayer(req.body).then(() => {
        res.send();
    })
});

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
            for(let i = 0; i < fromDb.players.length; i++) {
                room.players.push(JSON.parse(fromDb.players[i]));
            }
    
            //recreate the game
            room.game = JSON.parse(fromDb.game);
            //reconstruct the board for viewing end state
            game.recreateBoard(room.game);
            res.send(room);
        } else {
            res.statusCode = 400;
            res.send(false);
        }
    });
})

setInterval(() => {
    for (let i = rooms.length; i >= 0; i--) {
        let room = rooms[i];
        if (room) {
            //If the room is empty and it is older than a minute then remove it
            //if the game has finished then remove it too
            console.log(new Date().getTime() - new Date(room.createDate).getTime());
            if ((room.players.length == 0 && ((new Date().getTime() - new Date(room.createDate).getTime()) > 1000 * 60 * 1)) || (room.game && room.game.state === 'end')) {
                console.log('Room age:' + (new Date().getTime() - new Date(room.createDate).getTime()));
                console.log('Room number of players: ' + room.players.length)
                console.log('Removing room: ' + room.id);
                rooms.splice(i,1);
            }
        }
       
    }
    io.emit('rooms', rooms);
}, 6000);

//we want to enable cors for testing
io.set('origins', '*:*');

io.on('connection', socket => {
    
    let player = {};
   
    function updateRooms() {
        let toSend = JSON.parse(JSON.stringify(rooms));
        toSend.forEach(room => {
            delete room.game;
        })
        io.emit('rooms', rooms);
    }

    function updateGame(room) {

        for (let i = 0; i < room.game.players.length; i++) {
            let clientInfo = JSON.parse(JSON.stringify(room.game));

            clientInfo.hand = clientInfo.players.filter(p => p.playerId === room.players[i].playerId)[0].hand;

            for(let j = 0; j < clientInfo.players.length; j++) {
                delete clientInfo.players[j].hand;
            }

            delete clientInfo.dictionary;
            delete clientInfo.def;
            delete clientInfo.pool;
            delete clientInfo.firstTurn;
            delete clientInfo.handSize;
        
            clientInfo.yourTurn = (clientInfo.activePlayer === room.game.players[i].playerId);
            
            io.to(room.players[i].socketId).emit('setup', clientInfo);

        }
    }

    function gameOver(room) {
        io.to(room.roomId).emit('Game Over', '');
        
        let winner = room.players[0];
        for (let i = 0; i < room.players.length; i++) {
                if (winner.score < room.players[i].score) {
                    winner = room.players[i];
                }
        }

        storeGame(room);

        for (let i = 0; i < room.players.length; i++) {
            db.addGameToHistory(room.players[i].playerId, room.id);
        }

        let message = 'Player: ' + winner.playerName + ' has won with a score of: ' + winner.score
        io.to(room.id).emit('message', {from: 'Server', contents: message});
        io.to(room.id).emit('notification', {type: 'success', text: message});
    }

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

    function leave(){
        if (player.activeRoom) {
            let room = rooms.find(o => {
                return o.id == player.activeRoom;
             });

             console.log(room);

            if (room) {
                room.players = room.players.filter(p => p.playerId !== player.playerId);
                socket.leave(player.activeRoom);

                if (room.game) {
                    room.game.players = room.game.players.filter(p => p.playerId !== player.playerId);
                }
            }

            player.activeRoom = null;
            
        }

        updateRooms();
    }

    function sanitisePlayer(player) {
        let toReturn = JSON.parse(JSON.stringify(player));
        delete toReturn.password;
        delete toReturn.loginName;
        delete toReturn._id;
        delete toReturn.__v;
        return toReturn;
    }


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

    socket.on('joinRoom', roomId => {
        leave(); 

        let room = rooms.find(o => {
           return o.id == roomId;
        });

        console.log(room);

            if(room.players.filter(p => p.socketId === socket.id).length > 0  || (room.players.filter(p => p.playerId === player.playerId).length > 0)) {
                socket.emit('notification', {type: 'warning', text: 'You are already in this room'});
            } else if (player.activeRoom != null) {
                socket.emit('notification', {type: 'warning', text: 'You are already in a room'});
            } else if (room.players.length == room.maxPlayers) {
                socket.emit('notification', {type: 'warning', text: 'Room is full'});
            } else if (room.game && room.game.state === 'active') {
                socket.emit('notification', {type: 'warning', text: 'You are unable to join a game that has already started'});
            } else {
                let toPush = sanitisePlayer(player);
                room.players.push(toPush);
                player.activeRoom = roomId;
                socket.join(roomId);
                updateRooms();
                socket.emit('joinSuccess', player);
            }
        

       
    });

    socket.on('startGame', roomId => {
        let room = rooms.find(o => o.id === roomId);
        room.game = game.initialSetup(room.players, 8);
        try {
            updateGame(room);
            io.to(player.activeRoom).emit('notification', {type: 'success', text: 'Game Started'});
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('makeMove', moveReq => {
        let room = rooms.find(r => r.id == moveReq.roomId);
        if (room) {
            let res = game.makeMove(room.game, moveReq);
            let toBroadcast =  room.game.players.find(player => player.playerId === moveReq.from);
            console.log(res);
    
            if (res.valid) {
                game.changeTurn(room.game);
                let message = {contents: '', from: "Server"};
                if (moveReq.moveType === 'playTile') {
                    message.contents = 'Player: ' + toBroadcast.playerName + " has played: " + res.words.join(', ') + " to score: " + res.score + " points.";
                } else if (moveReq.moveType === 'pass') {
                    message.contents = 'Player: ' + toBroadcast.playerName + ' has passed their turn.';
                } else if (moveReq.moveType === 'exchange') {
                    message.contents = 'Player: ' + toBroadcast.playerName + ' has exchanged tiles.';
                }
    
                io.to(moveReq.roomId).emit('notification', {type: 'success', text: message.contents});
                io.to(moveReq.roomId).emit('message', message);    
                game.determineEnd(room.game);
            } else {
                socket.emit('notification', {type: 'warning', text: res.reason});
            }
    
            if (room.game.state === 'end') {
                gameOver(room);
            }
    
            updateGame(room);
        } else {
            socket.emit('notification', {type: 'danger', text: 'Unable to find room to make move'});
        }
        
    });

    socket.on('leaveRoom', any => {
        leave();
    });

    socket.on('messageRoom', message => {
        if (message.contents.length > 0) {
            socket.to(player.activeRoom).emit('message', message);
        }
    })

    socket.on('setPlayer', toSet => {
        toSet.socketId = socket.id;
        toSet.score = 0;
        player = toSet;
        db.updatePlayer(toSet);
        socket.emit('rooms', rooms);
    })

    //Once we connect we want to get a list of all rooms
    updateRooms();

    console.log('Socket' + socket.id + 'has connected');

});

