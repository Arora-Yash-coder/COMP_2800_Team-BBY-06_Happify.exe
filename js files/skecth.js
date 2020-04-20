function setup() {
    createCanvas(600, 400);
    background(255, 255, 153);
}

function draw() {

}
setInterval(function() {
noStroke();
fill(255, 192, 203);
ellipse(mouseX, mouseY, 30, 30);
if (mouseIsPressed) {
    background(255, 255, 153);
}
}, 0);