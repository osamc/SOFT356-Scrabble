//Set up the server
const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./server/database")
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const game = require('./server/gameLogic/game');


const dbConnection = "mongodb+srv://sam:password.0@scrabble-hs60n.mongodb.net/test?retryWrites=true&w=majority"
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

//Create app and listen on port
let server = app.listen(port, () => {
    console.log(`listening on port ${port}!`);
    mongoose.set('useFindAndModify', false);

    mongoose.connect(dbConnection, {useNewUrlParser: true, useUnifiedTopology: true}).then((test) => {
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
    db.createPlayer(player).then(res.send(player));
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
})

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

    
    function leave(){
        if (player.activeRoom) {
            let room = rooms.find(o => {
                return o.id == player.activeRoom;
             });

            room.players = room.players.filter(p => p != socket.id);
            socket.leave(player.activeRoom);
            player.activeRoom = null;
        }
    }

    socket.on('createRoom', room => {
        room.messages = [];
        rooms.push(room)
        updateRooms();
    });

    socket.on('joinRoom', roomId => {
        leave(); 

        let room = rooms.find(o => {
           return o.id == roomId;
        });

        if(room.players.filter(p => p === socket.id).length > 0) {
            socket.emit('joinFailed', 'true');
        } else {
            room.players.push(player);
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
        } catch (err) {
            console.log(err);
        }
    });

    socket.on('makeMove', moveReq => {
        let room = rooms.find(r => r.id == moveReq.roomId);
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

            io.to(moveReq.roomId).emit('message', message);    

          
        }

        updateGame(room);

    });

    socket.on('leaveRoom', any => {
        leave();
    });


    socket.on('messageRoom', message => {
        console.log(player.activeRoom);
        console.log(message);
        socket.to(player.activeRoom).emit('message', message);
    })


    socket.on('setPlayer', toSet => {
        toSet.socketId = socket.id;
        toSet.score = 0;
        player = toSet;
        socket.emit('rooms', rooms);
    })

    //Once we connect we want to get a list of all rooms
    updateRooms();

    console.log('Socket' + socket.id + 'has connected');

})
