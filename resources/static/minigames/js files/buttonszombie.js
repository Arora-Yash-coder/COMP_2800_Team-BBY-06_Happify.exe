function Button(x, y, dir1, dir2) {
    this.x = x;
    this.y = y;

    this.display = function () {
    
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(this.x, this.y, 120, 50);
    }

    this.clicked = function () {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d < 40) {
            console.log("aaaaaaaaaaa");
        }
    }
}