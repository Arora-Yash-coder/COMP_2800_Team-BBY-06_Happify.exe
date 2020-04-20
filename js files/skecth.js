let bubble;

function setup() {
    createCanvas(windowWidth, windowHeight);
    bubble = new Bubble(300,200,12);
    print(bubble.x,bubble.y);
}
class Bubble {
    constructor(x,y,r){
        this.x = x;
        this.y = y;
        this.r = r;
    }
    move () {
        this.x = this.x + random(-5,5);
        this.y = this.y + random(-5,5);
    }
    show (){
        stroke(255);
        strokeWeight(4);
        noFill();
        ellipse(this.x,this.y,this.r*2);
    }
}

function draw() {
    background(0);
    
    bubble.move();
    bubble.show();
}
