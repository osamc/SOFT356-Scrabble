//Set up the server
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 9000;

//Locate the build folder of the angular app
const angularApp = __dirname + '/dist/soft356scrabble/';

//We want to use our angular app
app.use(express.static(angularApp));

//Example get request
app.get('/example', (req, res) => res.send('Hello World!'));

//Required to hose the angular app within the server
app.get('/', (req, res) => {
    res.sendFile(angularApp + 'index.html');
})

//Create app and listen on port
let server = app.listen(port, '0.0.0.0', () => {
    console.log(`listening on port ${port}!`);
});

//Initialise socket io
let io = require('socket.io').listen(server);

//Variables for keeping track of rooms and players,
//can be replaced by db eventually
const rooms = [];
const players = {};

//we want to enable cors for testing
io.set('origins', '*:*');

io.on('connection', socket => {
    
    let previousId;
    let player = {};
   
    function updateRooms() {
        io.emit('rooms', rooms);
    }

    function updatePlayer() {
        socket.emit('player', player);
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
            room.players.push(socket.id);
            player.activeRoom = roomId;
            socket.join(roomId);
            updateRooms();
            socket.emit('joinSuccess', player);
        }

    });

    socket.on('leaveRoom', any => {
        leave();
    });


    socket.on('messageRoom', message => {
        socket.to(player.activeRoom).emit('message', message);
    })

    //Once we connect we want to get a list of all rooms
    io.emit('rooms', rooms);

    player.playerId = socket.id;
    
    players[player.playerId] = player;

    updatePlayer();
    console.log('Socket' + socket.id + 'has connected');

})
