function Button(x, y, dir1, dir2) {
    this.x = x;
    this.y = y;

    this.display = function () {
        noStroke();
        fill(255, 255, 255, 100);
        rectMode(CENTER);
        rect(this.x, this.y, 4, 3, 3);
    }

    this.clicked = function () {
        let d = dist(mouseX / 20, mouseY / 20, this.x, this.y);
        if (d < 2) {
            snake.setDir(dir1, dir2);
        }
    }

}