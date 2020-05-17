var express = require('express');
var app = express();
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


const stockfish = require('stockfish');
var stockfishes = [];
var id = 0;
var uci = [];
stockfishes[id] = stockfish();
uci[id] = "position startpos moves "


global.__basedir = __dirname;
app.use(express.static('resources'))
app.get("/game/chess", (req, res) => {
    res.sendFile(__dirname + "/chessboard.html")
})

app.get("/restart",(req,res)=>{
    uci[id] = "position startpos moves ";
    stockfishes[id].postMessage(uci[id]);
    res.redirect("/game/chess")
})

app.post("/game/chess", (req, res) => {
    // console.log("req.body")
    // console.log(req.body)
    var next_move = []
    console.log("uci-=================================================")
    console.log(req.body["uci"])
    stockfishes[id].postMessage(uci[id] + " " + req.body["uci"]);
    uci[id] =  uci[id] + " " + req.body["uci"]
    console.log("-=---------=-=-=-=-=-=-uic[id]-=-=-=-=-=-=-=-=-=-=-=-=");
    console.log(uci[id]);
    stockfishes[id].postMessage("go infinite");
    setTimeout(() => {
        stockfishes[id].postMessage("stop");
        stockfishes[id].postMessage("d");
    }, 100);

    
    stockfishes[id].onmessage = function (message) {
        if (message.startsWith("bestmove")) {

            next_move = message.split(" ")
           
        }
        if(next_move.length !=0 ){
            console.log("msg");
            console.log(next_move);
            //1 is the position where the bestmove uci is
            uci[id] =  uci[id] + " " + next_move[1]
            res.send(next_move[1])
        }
        console.log(message)
    }



})



var server = app.listen(1234, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("App listening at http://%s:%s", host, port)

})

