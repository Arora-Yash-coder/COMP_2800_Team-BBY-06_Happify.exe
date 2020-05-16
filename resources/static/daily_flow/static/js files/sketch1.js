var blob;
let borderx;
let bordery;
let canvas2;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  blob = new Blob(0, 0, 64,135,206,250);
  borderx = width;
  bordery = height;

  canvas2 = createGraphics(2*window.innerWidth, 2*window.innerHeight);
  canvas2.clear();
  console.log(canvas2.x);
  canvas2.strokeWeight(10);
  for (var i = 0; i < 200; i++) {
      var x = random(-width+20, width-20);
      var y = random(-height+20, height-20);
      blobs[i] = new Blob(x, y, 16,random(255),random(255),random(255));
    }

  setInterval(function () {
    for (var i = 0; i < 200; i++) {
      var x = random(-width+20, width-20);
      var y = random(-height+20, height-20);
      blobs[i] = new Blob(x, y, 16,random(255),random(255),random(255));
    }
  },30000)
}

function draw() {
  background(255);
  
  
  translate(width / 2, height / 2);
  
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);
  
  

    for (var i = blobs.length - 1; i >= 0; i--) {
      blobs[i].show();
      if (blob.eats(blobs[i])) {
        blobs.splice(i, 1);
      }
    }
  
  

  blob.show();
  blob.update();

  
  if (blob.pos.x < (-borderx - blob.r)) {
    blob.pos.x = borderx + blob.r;
  } else if (blob.pos.x > (borderx + blob.r)) {
    blob.pos.x = -borderx - blob.r;
  }
  if (blob.pos.y < -bordery - blob.r) {
    blob.pos.y = bordery + blob.r;

  } else if (blob.pos.y > bordery + blob.r) {
    blob.pos.y = -bordery - blob.r;
  }
  translate(-width ,-height );
  image(canvas2,0,0);
  canvas2.line(0,0,2*borderx,0);
  canvas2.line(0,0,0,2*bordery);
  canvas2.line(2*borderx,0,2*borderx,2*bordery);
  canvas2.line(0,2*bordery,2*borderx,2*bordery);
}
