let snake;
let rez = 20;
let food;
let w;
let h;
let button1;
let button2;
let button3;
let button4;
let menuBtn;
let easter = 0;

let score = 0;
let img;
let virus;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  img = loadImage('Resources/Extras/virus.png');
  w = floor(width) / rez;
  h = floor(height) / rez;
  frameRate(5);
  snake = new Snake();
  foodLocation();
}
/**----------------Food For Snake-----------------------*/

function foodLocation() {
  let x = floor(random(floor(w - (20 / rez))));
  let y = floor(random(floor(h - (20 / rez))));
  noFill();
  food = createVector(x, y);
}
/**----------------For Desktop Players------------------*/
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
    easter ++;
    if(easter == 4){
      foodLocation();
    }
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  }
}

/**---------------For Mobile Player---------------------*/
function mousePressed() {
  button1.clicked();
  button2.clicked();
  button3.clicked();
  button4.clicked();
}


function draw() {
  scale(rez);
  background(255);
  virus = image(img, food.x-0.5, food.y-0.5, 40 / 20, 40 / 20);

  /**----------------Controls------------------------------*/
  button1 = new Button(6, h - 5, 0, -1);
  button1.display();
  button2 = new Button(6, h - 2, 0, 1);
  button2.display();
  button3 = new Button(10, h - 2, 1, 0);
  button3.display();
  button4 = new Button(2, h - 2, -1, 0);
  button4.display();

  /**----------------Menu Button-------------------------*/
  noStroke();
  fill(255,182,193, 100);
  rectMode(CORNER);
  rect(0.5, 0.5, 4.5, 2.5, 3);
  textFont('dejavu');
  textSize(1.5);
  fill(0);
  text('Menu', 1, 2);
  let d = dist(mouseX / 20, mouseY / 20, 2.75, 1.75);
  if (d < 1.25) {
    // Code goes here to move back to menu.
    window.location.href = "/minigames"
    print("Yaaaa");
  }

  /**--------------------Score System--------------------*/
  textFont('dejavu');
  textSize(1.5);
  fill(255,182,193);
  text('Score: ' + score, w - 5.5, 2);

  if (snake.eat(food)) {
    foodLocation();
    score++;
    print(score);
  }
  snake.update();
  snake.show();

  if (snake.endGame()) {
    print("END GAME");
    background(255, 0, 0);
    noLoop();
  }

  noStroke();
  fill(0, 0, 0, 0);
  rect(food.x, food.y, 1, 1);
}