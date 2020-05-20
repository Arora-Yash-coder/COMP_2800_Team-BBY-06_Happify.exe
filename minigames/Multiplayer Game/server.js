let express = require('express');
let socket = require('socket.io');
let app = express();
let server = app.listen(2000);
let players = [];
let laser = [];
let io = socket(server);


function Player(id, x, y, imgIndex) {
    this.id = id,
        this.x = x,
        this.y = y,
        this.imgIndex = imgIndex;
}


app.use(express.static('public'));
app.get("/", (req, res) => {
    res.sendFile("/index.html");
});


setInterval(heartbeat, 1000 / 200);
function heartbeat() {
    io.sockets.emit('heartbeat', players);
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}


io.sockets.on('connection', function (socket) {

    socket.on('start', function (user) {
        let newPlayer = new Player(socket.id, user.x, user.y, user.imgIndex);
        players.push(newPlayer);
    })

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
    socket.on('updateLaser', function (userLaser) {
        laser = userLaser;
        io.sockets.emit('updateLaserServer', laser);
    })
    socket.on('removeLaser', function (data) {
        io.to(data.uid).emit("removeLaserClient", data);
    })
    socket.on('removeUser', function (data) {
        for (let i = 0; i < players.length; i++) {
            if (data == players[i].id) {
                players.splice(i, 1);
            }
        }
        io.sockets.emit('heartbeat', players);
    })

    socket.on("disconnect", function(s) {

        for (let i = 0; i < players.length; i++) {
            if (socket.id == players[i].id) {
                players.splice(i, 1);
            }
        }
        io.sockets.emit('heartbeat', players);
    });
    




})