let snake;
let rez = 20;
let food;
let w;
let h;
let button1;
let button2;
let button3;
let button4;

let score = 0;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  w = floor(width / rez);
  h = floor(height / rez);
  frameRate(5);
  snake = new Snake();
  foodLocation();
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}
/**----------------For Desktop Players------------------ */
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW) {
    snake.setDir(0, -1);
  } else if (key == ' ') {
    snake.grow();
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
  background(51);

  button1 = new Button(8, h - 8, 0, -1);
  button1.display();
  button2 = new Button(8, h - 2, 0, 1);
  button2.display();
  button3 = new Button(14, h - 2, 1, 0);
  button3.display();
  button4 = new Button(2, h - 2, -1, 0);
  button4.display();

  textSize(2);
  fill(255);
  text('Score: ' + score, w - 10, 2);

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
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
}