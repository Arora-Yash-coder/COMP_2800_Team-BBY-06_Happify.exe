function Character (x, y,imgIndex){
    this.x = x;
    this.y = y;
    this.imgIndex = imgIndex;

    this.show = function () {
        image(imgs[this.imgIndex], this.x, this.y);
    }
    this.constrain = function (p) {
        user.x = constrain(user.x,0,width - 64);
        user.y = constrain(user.y,0,height - 64);
    }
    this.killed = function () {
        for(let i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                return false;
            }
        }
        return true;
    }
}