let socket;
let user;
let imgs = [];
let players = [];
let enemyLaser = [];
let userLaser = [];
let flag = true;
let Score = 0;


let button1;
let button2;
let button3;
let button4;
let btn5;
let menuBtn;

//PreLoading all the Images
function preload() {
		//I changed all the links to opt in with the routes of our app.(Judao 19:46 May 20)
    imgs[0] = loadImage('/static/minigames/multiplayer/character/Character_57.png');
    imgs[1] = loadImage('/static/minigames/multiplayer/character/Character_81.png');
    imgs[2] = loadImage('/static/minigames/multiplayer/character/Character_224.png');
    imgs[3] = loadImage('/static/minigames/multiplayer/character/Character_251.png');
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    socket = io.connect('http://localhost:300');
    user = new Character(random(width), random(height), 1);
    socket.emit('start', user);
    socket.on('heartbeat', function (data) {
        players = data;
    })
    socket.on('updateLaserServer', laserUpdate);
    socket.on('removeLaserClient', removeLaser)
}



function draw() {
    background(255);
    fill(0);
    textSize(28);
    textFont('dejavu');
    text("Score: " + Score, width - 120, 30);
    if (keyIsPressed == true && !user.killed()) {
        keys();
    }

    if (mouseIsPressed) {
        button1.clicked();
        button2.clicked();
        button3.clicked();
        button4.clicked();
        button5.clicked();
        let d = dist(mouseX, mouseY, 55, 35);
        if (d < 25) {
            // Code goes here to move back to menu.
            window.location.href = "https://www.google.com"
            print("Yaaaa");
        }
    }

    button1 = new Button(120, height - 100, 0);
    button1.display();
    button2 = new Button(120, height - 40, 1);
    button2.display();
    button3 = new Button(200, height - 40, 3);
    button3.display();
    button4 = new Button(40, height - 40, 2);
    button4.display();
    button5 = new Button(width - 60, height - 40, 4);
    button5.display();
    noStroke();
    fill(0, 255, 128, 100);
    rectMode(CORNER);
    rect(10, 10, 90, 50, 60);
    textFont('dejavu');
    textSize(30);
    fill(0);
    text('Menu', 20, 40);


    user.constrain();
    socket.emit('update', user);
    socket.emit('updateLaser', userLaser);

    //Player Display Function
    for (let i = players.length - 1; i >= 0; i--) {
        image(imgs[players[i].imgIndex], players[i].x, players[i].y);
    }
    //Lasers Display Function
    for (let i = 0; i < enemyLaser.length; i++) {
        enemyLaser[i].movement();
        enemyLaser[i].show();
    }

    // Controls Movement of the Bullets
    for (let i = 0; i < userLaser.length; i++) {
        if (userLaser[i] !== 'undefined') {
            userLaser[i].movement();
        }
    }

    for (let i = 0; i < userLaser.length; i++) {
        let d = dist(userLaser[i].x, userLaser[i].y, user.x, user.y);
        if (d > width) {
            userLaser.splice(i, 1);
            continue;
        }
    }
    //Collision Detection
    for (let j = 0; j < enemyLaser.length; j++) {
        if (enemyLaser[j] === undefined || enemyLaser[j].uid == socket.id) {} else {
            if (enemyLaser[j].x >= user.x - 32 && enemyLaser[j].x <= user.x + 32 && enemyLaser[j].y >= user.y - 32 && enemyLaser[j].y <= user.y + 32) {
                socket.emit('removeUser', socket.id);
                socket.emit('removeLaser', enemyLaser[j]);
                socket.emit('updateLaser', userLaser);
            }
        }
    }

    if (user.killed()) {
        background(255, 0, 0)
    }

}


// Movement Control of the Player
function keys() {
    if (keyCode === LEFT_ARROW) {
        user.imgIndex = 2;
        user.x -= 2;
    } else if (keyCode === RIGHT_ARROW) {
        user.imgIndex = 3;
        user.x += 2;
    } else if (keyCode === DOWN_ARROW) {
        user.imgIndex = 1;
        user.y += 2;
    } else if (keyCode === UP_ARROW) {
        user.imgIndex = 0;
        user.y -= 2;
    } else if (keyCode === 32) {
        if (flag == true) {
            let newLaser = new Laser(user.x, user.y, user.imgIndex, randomString(16), socket.id);
            userLaser.push(newLaser);
            socket.emit('updateLaser', userLaser);
            flag = false;
            setTimeout(function () {
                flag = true;
            }, 400)
        }
    }
}

//Generates Unique Id for The Bullets
function randomString(length) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }
    let str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
//Updates All the Lasers
function laserUpdate(data) {
    enemyLaser = [];
    for (let i = 0; i < data.length; i++) {
        let newLaser = new Laser(data[i].x, data[i].y, data[i].imgIndex, data[i].id, data[i].uid);
        enemyLaser.push(newLaser);
    }

}
//Removes Laser
function removeLaser(data) {
    Score++;
    for (let i = 0; i < userLaser.length; i++) {
        if (data.id == userLaser[i].id) {
            userLaser.splice(i, 1);
            socket.emit('updateLaser', userLaser);
        }
    }
}