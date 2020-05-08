function Button(x, y, dir1, dir2) {
    this.x = x;
    this.y = y;

    this.display = function () {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.x, this.y, 150, 100);
    }

    this.clicked = function () {
        let d = dist(mouseX / 20, mouseY / 20, this.x, this.y);
        if (d < 2) {
            snake.setDir(dir1, dir2);
        }
    }

}