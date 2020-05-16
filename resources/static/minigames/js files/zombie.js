let canvas = document.getElementById("canvas");
<<<<<<< HEAD
=======
let body = document.getElementById("body");
>>>>>>> judao_tiffany_backend
if (canvas.width < window.innerWidth) {
  canvas.width = window.innerWidth;
}
if (canvas.height < window.innerHeight) {
  canvas.height = window.innerHeight;
}

const LASER_DIST = 0.6;
const FPS = 120; //Frames Per Second.
const CHARACTER_SIZE = 50; //Character Size in Pixels
const CHARACTER_SPEED = 5; //PX per Key Pressed
let ZOMBIES_NUM = 15; //Starting number of zombies
const ZOMBIE_SIZE = 50;
const ZOMBIE_SPEED = 16;
const SHOW_BOUNDING = false;
const LASER_MAX = 15;
const LASER_SPEED = 200;
const TEXT_FADE_TIME = 2.5; // text fade time in seconds
const TEXT_SIZE = 40; // text font height in pixels
const POINTS = 10;
const SAVE_KEY_SCORE = "highscore";

let count = 0;
let level = 0;
let Damage = 0;
let button1;
let button2;
let button3;
let button4;
<<<<<<< HEAD
=======
let button5;
let flag = true;
>>>>>>> judao_tiffany_backend

let xposition = new Array();
let yposition = new Array();
let zombies = [];

let ctx = canvas.getContext("2d");

let audio = document.getElementById("monica");
audio.loop = true;

let textAlpha;
let text;
let score = 0;
let highscore;
let scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
if (scoreStr == null) {
  highscore = 0;
} else {
  highscore = parseInt(scoreStr);
}


window.addEventListener('mousemove', function (e) {
  xposition.push(e.x);
  yposition.push(e.y);
});

<<<<<<< HEAD
var character = {
=======
let character = {
>>>>>>> judao_tiffany_backend
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: CHARACTER_SIZE / 2,
  lasers: [],
  src: 'Resources/Character/Character_81.png',
  a: 270 / 180 * Math.PI, //Convert to Radians
  d: 3
}

// Set Up Event Handler.
document.addEventListener("keydown", keydown);

function keydown( /** @type {KeyboardEvent} */ ev) {
  switch (ev.keyCode) {
    case 32:
      shootLaser();
      let obj = document.getElementById("pew");
      obj.play();
      audio.play();
      audio.volume = 0.2;
      break;
    case 37:
      character.x -= CHARACTER_SPEED;
      character.src = 'Resources/Character/Character_224.png';
      character.d = 2;
      audio.play();
      audio.volume = 0.2;
      break;
    case 38:
      character.y -= CHARACTER_SPEED;
      character.src = 'Resources/Character/Character_57.png';
      character.d = 1;
      audio.play();
      audio.volume = 0.2;
      break;
    case 39:
      character.x += CHARACTER_SPEED;
      character.src = 'Resources/Character/Character_251.png';
      character.d = 0;
      audio.play();
      audio.volume = 0.2;
      break;
    case 40:
      character.y += CHARACTER_SPEED;
      character.src = 'Resources/Character/Character_81.png';
      character.d = 3;
      audio.play();
      audio.volume = 0.2;
      break;
  }
}



// set Game Loop
let x = setInterval(update, 1000 / FPS);

function generatezombies(n) {
  zombies = [];
  for (let i = 0; i < n; i++) {
    let xr = Math.floor(Math.random() * canvas.width);
    let yr = Math.floor(Math.random() * canvas.height);
    while (distBetweenPositions(character.x, character.y, xr, yr) < ZOMBIE_SIZE * 3 + character.r) {
      xr = Math.floor(Math.random() * canvas.width);
      yr = Math.floor(Math.random() * canvas.height);
    }
    count++;
    zombies.push(newZombie(xr, yr));
  }
}

function distBetweenPositions(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function newZombie(x, y) {
  let zomb = {
    x: x,
    y: y,
    r: ZOMBIE_SIZE / 2,
    a: 270 / 180 * Math.PI,
    src: 'Resources/Extras/virus.png'
  }
  return zomb;
}

function shootLaser() {
  // create the laser object
  if (character.lasers.length < LASER_MAX) {
    character.lasers.push({ // from the nose of the character
      x: character.x + 35,
      y: character.y + 35,
      xv: LASER_SPEED * Math.cos(character.a) / FPS,
      yv: -LASER_SPEED * Math.sin(character.a) / FPS,
      dist: 0,
    });
  }
}


function update() {
<<<<<<< HEAD
=======
  
>>>>>>> judao_tiffany_backend
  setInterval(function () {
    if (count == 0) {
      generatezombies(ZOMBIES_NUM);
      // textalpha -= 1.0/2.5/FPS;
      ZOMBIES_NUM = ZOMBIES_NUM + 5;
      level++;
      textAlpha = 1.0;
    }
  }, 1000 / FPS);

  
  // BackGround---------------------------------------------------------------
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let characterobj = new Image();
  characterobj.src = character.src;
  ctx.drawImage(characterobj, character.x, character.y);


  let w = Math.floor(window.innerWidth);
  let h = Math.floor(window.innerHeight);
<<<<<<< HEAD
  button1 = new Button(170, h - 120, 0, -1);
  button1.display();
  button2 = new Button(170, h - 60, 0, 1);
  button2.display();
  button3 = new Button(300, h - 60, 1, 0);
  button3.display();
  button4 = new Button(40, h - 60, -1, 0);
  button4.display();
=======
  button1 = new Button(170, h - 120,3);
  button1.display();
  button2 = new Button(170, h - 60,5);
  button2.display();
  button3 = new Button(300, h - 60,4);
  button3.display();
  button4 = new Button(40, h - 60,2);
  button4.display();
  button5 = new Button(w/2 - 60, h - 60,1);
  button5.display();

  
  body.addEventListener('click', e => {
    if(flag == true){
      button1.clicked();
      button2.clicked();
      button3.clicked();
      button4.clicked();
      button5.clicked();
      setTimeout(function () {
        flag = true;
      },100)
    }
    flag = false;
  });
  
>>>>>>> judao_tiffany_backend

  // Level Text----------------------------------------------------------------
  if (textAlpha >= 0) {
    text = "Level " + level;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
    ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
  }
  // Score-------------------------------------------------------------------------
  let texts = "Score : " + score;
  ctx.textAlign = "Right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
  ctx.fillText(texts, canvas.width - CHARACTER_SIZE * 2, CHARACTER_SIZE / 2);

  // HighScore----------------------------------------------------------------------
  let texths = "Best : " + highscore;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
  ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
  ctx.fillText(texths, canvas.width / 2, CHARACTER_SIZE / 2);
  // Lives and Game Over------------------------------------------------------------
  let image1 = new Image();
  image1.src = 'Resources/Character/Character_81.png';
  ctx.drawImage(image1, 0, 0);
  let image2 = new Image();
  image2.src = 'Resources/Character/Character_81.png';
  ctx.drawImage(image2, 70, 0);
  let image3 = new Image();
  image3.src = 'Resources/Character/Character_81.png';
  ctx.drawImage(image3, 140, 0);
  if (Damage == 0) {

  } else if (Damage == 1) {
    ctx.fillStyle = "white";
    ctx.fillRect(140, 0, 70, 70);
  } else if (Damage == 2) {
    ctx.fillStyle = "white";
    ctx.fillRect(70, 0, 140, 70);
  } else {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 210, 70);
    clearInterval(x);
    text = "Game Over";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
    ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    setTimeout(function () {
      window.location.reload()
    }, 10000)
  }


  // Collisions---------------------------------------------------------------

<<<<<<< HEAD
  var ax, ay, ar, lx, ly;
  for (var i = zombies.length - 1; i >= 0; i--) {
=======
  let ax, ay, ar, lx, ly;
  for (let i = zombies.length - 1; i >= 0; i--) {
>>>>>>> judao_tiffany_backend
    // grab the asteroid properties
    ax = zombies[i].x + 35;
    ay = zombies[i].y + 35;
    ar = zombies[i].r;
<<<<<<< HEAD
    for (var j = character.lasers.length - 1; j >= 0; j--) {
=======
    for (let j = character.lasers.length - 1; j >= 0; j--) {
>>>>>>> judao_tiffany_backend
      // grab the laser properties
      lx = character.lasers[j].x;
      ly = character.lasers[j].y;

      // detect hits
      if (distBetweenPositions(ax, ay, lx, ly) < ar) {
        character.lasers.splice(j, 1);
        zombies.splice(i, 1);
        count--;
        score += POINTS;
        break;
      }
      if (score > highscore) {
        highscore = score;
        localStorage.setItem(SAVE_KEY_SCORE, highscore);
      }
    }
  }
  //HIT BOX---------------------------------------------------------------
  if (SHOW_BOUNDING) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.arc(character.x + 35, character.y + 35, character.r, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  for (let i = 0; i < zombies.length; i++) {
    let zombieobj = new Image();
    zombieobj.src = zombies[i].src;
    ctx.drawImage(zombieobj, zombies[i].x, zombies[i].y);

    //Movement of Zombie
    if (character.x > zombies[i].x) {
      zombies[i].x += ZOMBIE_SPEED / FPS;
    } else if (character.x < zombies[i].x) {
      zombies[i].x -= ZOMBIE_SPEED / FPS;
    }
    if (character.y > zombies[i].y) {
      zombies[i].y += ZOMBIE_SPEED / FPS;
    } else if (character.y < zombies[i].y) {
      zombies[i].y -= ZOMBIE_SPEED / FPS;
    }

    // Borders
    if (zombies[i].x < 0 - zombies[i].r) {
      zombies[i].x = canvas.width + character.r;
    } else if (zombies[i].x > canvas.width + zombies[i].r) {
      zombies[i].x = 0 - character.r;
    }
    if (zombies[i].y < 0 - zombies[i].r) {
      zombies[i].y = canvas.height + character.r;

    } else if (zombies[i].y > canvas.height + zombies[i].r) {
      zombies[i].y = 0 - character.r;
    }


    if (SHOW_BOUNDING) {
      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.arc(zombies[i].x + 35, zombies[i].y + 35, zombies[i].r, 0, Math.PI * 2, false);
      ctx.stroke();
    }


    if (distBetweenPositions(character.x, character.y, zombies[i].x, zombies[i].y) < character.r + zombies[i].r) {

      character.x = canvas.width / 2;
      character.y = canvas.height / 2;
      Damage++;
      let x = document.getElementById("oof");
      x.play();
    }

  }
  // Creating the Bullet
<<<<<<< HEAD
  for (var i = 0; i < character.lasers.length; i++) {
=======
  for (let i = 0; i < character.lasers.length; i++) {
>>>>>>> judao_tiffany_backend
    ctx.fillStyle = "lightBlue";
    ctx.beginPath();
    ctx.arc(character.lasers[i].x, character.lasers[i].y, CHARACTER_SIZE / 15, 0, Math.PI * 2, false);
    ctx.fill();
  }
  // Moving The Lasers
<<<<<<< HEAD
  for (var i = character.lasers.length - 1; i >= 0; i--) {
=======
  for (let i = character.lasers.length - 1; i >= 0; i--) {
>>>>>>> judao_tiffany_backend
    // check distance travelled
    if (character.lasers[i].dist > LASER_DIST * canvas.width) {
      character.lasers.splice(i, 1);
      continue;
    }
    // move the laser
    if (character.d == 3) {
      character.lasers[i].y += 3;
    } else if (character.d == 2) {
      character.lasers[i].x -= 3;
    } else if (character.d == 1) {
      character.lasers[i].y -= 3;
    } else {
      character.lasers[i].x += 3;
    }
    
    // calculate the distance travelled
    character.lasers[i].dist += Math.sqrt(Math.pow(character.lasers[i].xv, 2) + Math.pow(character.lasers[i].yv, 2));
  }

  // Border for Character
  if (character.x < 0 - character.r) {
    character.x = canvas.width + character.r;
  } else if (character.x > canvas.width + character.r) {
    character.x = 0 - character.r;
  }
  if (character.y < 0 - character.r) {
    character.y = canvas.height + character.r;

  } else if (character.y > canvas.height + character.r) {
    character.y = 0 - character.r;
  }
}
