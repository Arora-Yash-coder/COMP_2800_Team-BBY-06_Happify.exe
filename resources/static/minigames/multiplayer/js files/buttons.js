function Button(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;

    this.display = function () {
        noStroke();
        fill(0,255,128, 100);
        rectMode(CENTER);
        rect(this.x, this.y, 60, 30, 60);
    }

    this.clicked = function () {
        let d = dist(mouseX, mouseY, this.x, this.y);
        if (d < 20) {
            if (this.dir == 2) {
                user.imgIndex = 2;
                user.x -= 2;
            } else if (this.dir == 3) {
                user.imgIndex = 3;
                user.x += 2;
            } else if (this.dir == 1) {
                user.imgIndex = 1;
                user.y += 2;
            } else if (this.dir == 0) {
                user.imgIndex = 0;
                user.y -= 2;
            } else if (this.dir == 4) {
                if (flagaa == true) {
                    let newLaser = new Laser(user.x, user.y, user.imgIndex, randomString(16), socket.id);
                    userLaser.push(newLaser);
                    socket.emit('updateLaser', userLaser);
                    flagaa = false;
                    setTimeout(function () {
                        flagaa = true;
                    }, 400)
                }
            }
        }
    }

}