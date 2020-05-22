function Laser(x, y, dir, id, uid) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.id = id;
    this.uid = uid;

    this.show = function () {
        fill(255,0,0);
        noStroke();
        ellipse(this.x + 32,this.y + 32,5,5);
    }

    this.movement = function () {
        if (this.dir == 0) {
            this.y -=5;
        } else if (this.dir == 1) {
            this.y +=5;
        } else if (this.dir == 2) {
            this.x -=5;
        } else if (this.dir == 3) {
            this.x +=5;
        }
    }
}