let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(2000);
let players = [];
let laser = [];
let io = socket(server);

//Keeps Track of all the Players
function Player(id, x, y, imgIndex) {
    this.id = id,
        this.x = x,
        this.y = y,
        this.imgIndex = imgIndex;
}

//Connection
app.use(express.static('public'));
app.get("/", (req, res) => {
    res.sendFile("/index.html");
});

//Refreshes Players every 5ms
setInterval(heartbeat, 1000 / 200);
function heartbeat() {
    io.sockets.emit('heartbeat', players);
}




io.sockets.on('connection', function (socket) {
    //On Connection Creates a new Player
    socket.on('start', function (user) {
        let newPlayer = new Player(socket.id, user.x, user.y, user.imgIndex);
        players.push(newPlayer);
    })

    //Updates all the Players 
    socket.on('update', function (user) {
        let play;
        for (let i = 0; i < players.length; i++) {
            if (socket.id == players[i].id) {
                play = players[i];
            }
        }
        if (play === undefined || user.x === undefined) {} else {
            play.x = user.x;
            play.y = user.y;
            play.imgIndex = user.imgIndex;
        }
    })

    //It Updates all the Bullets on the Server
    socket.on('updateLaser', function (userLaser) {
        laser = userLaser;
        io.sockets.emit('updateLaserServer', laser);
    })
    //When a collision is detected it removes the Laser
    socket.on('removeLaser', function (data) {
        io.to(data.uid).emit("removeLaserClient", data);
    })
    // When a Player Gets Killed it refreshes all the clients
    socket.on('removeUser', function (data) {
        for (let i = 0; i < players.length; i++) {
            if (data == players[i].id) {
                players.splice(i, 1);
            }
        }
        io.sockets.emit('heartbeat', players);
    })
    // When a Player Disconnects it refreshes all the clients
    socket.on("disconnect", function(s) {
        for (let i = 0; i < players.length; i++) {
            if (socket.id == players[i].id) {
                players.splice(i, 1);
            }
        }
        io.sockets.emit('heartbeat', players);
    });
})