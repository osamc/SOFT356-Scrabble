//Set up the server
const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./server/database")
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

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
    console.log("update: ");
    console.log(req.body);
    db.updatePlayer(req.body).then(() => {
        res.send();
    })
})

//we want to enable cors for testing
io.set('origins', '*:*');

io.on('connection', socket => {
    
    let player = {};
   
    function updateRooms() {
        io.emit('rooms', rooms);
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
        rooms.push(room)
        updateRooms();
    });

    socket.on('joinRoom', roomId => {
        
        leave();
        
        //console.log(socket.id + ': join room: ' + roomId )
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

    })

    socket.on('leaveRoom', any => {
        leave();
    });


    socket.on('messageRoom', message => {
        socket.to(player.activeRoom).emit('message', message);
    })


    socket.on('setPlayer', toSet => {
        toSet.socketId = socket.id;
        player = toSet;
        socket.emit('rooms', rooms);
    })

    //Once we connect we want to get a list of all rooms
    io.emit('rooms', rooms);

    console.log('Socket' + socket.id + 'has connected');

})
