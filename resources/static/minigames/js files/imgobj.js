
function imgobj(src,x, y,w,h) {
    this.src = src;
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.vel = createVector(0, 0);
  
    this.update = function() {
      var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
      newvel.setMag(3);
      this.vel.lerp(newvel, 0.2);
      this.pos.add(this.vel);
    };
  
    this.eats = function(other) {
      var d = p5.Vector.dist(this.pos, other.pos);
      if (d < this.rad + other.rad) {
        var sum = PI * this.rad * this.rad + PI * other.rad * other.rad;
        this.rad = sqrt(sum / PI);
        //this.r += other.r;
        return true;
      } else {
        return false;
      }
    };
  
    this.show = function() {
      image(this.src, this.pos.x-0.5, this.pos.y-0.5, 40 / 20, 40 / 20);
    };
  }
  