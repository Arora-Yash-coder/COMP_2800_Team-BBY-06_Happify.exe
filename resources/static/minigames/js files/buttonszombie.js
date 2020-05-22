let posX;
let posY;

function Button(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    this.display = function () {

        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(this.x, this.y, 120, 50);
    }

    this.clicked = function () {
        let d = distBetweenPositions(posX, posY, this.x + 60, this.y + 25);
        if (d < 40) {
            if (id == 1) {
                shootLaser();
                let obj = document.getElementById("pew");
                obj.play();
                audio.play();
                audio.volume = 0.2;
            } else if (id == 2) {
                character.x -= CHARACTER_SPEED;
                character.src = 'Resources/Character/Character_224.png';
                character.d = 2;
                audio.play();
                audio.volume = 0.2;
            } else if (id == 3) {
                character.y -= CHARACTER_SPEED;
                character.src = 'Resources/Character/Character_57.png';
                character.d = 1;
                audio.play();
                audio.volume = 0.2;
            } else if (id == 4) {
                character.x += CHARACTER_SPEED;
                character.src = 'Resources/Character/Character_251.png';
                character.d = 0;
                audio.play();
                audio.volume = 0.2;
            } else if (id == 5) {
                character.y += CHARACTER_SPEED;
                character.src = 'Resources/Character/Character_81.png';
                character.d = 3;
                audio.play();
                audio.volume = 0.2;
            } else if (id == 6){
                //Code to Go Back To minigames Page
            }
        }
    }
}

onmousemove = function (e) {
    posX = e.clientX;
    posY = e.clientY;
}

$(document).ready(function () {

    let i = 0,
        timeOut = 0;

    $('body').on('mousedown touchstart', function (e) {
        $(this).addClass('active');
        timeOut = setInterval(function () {
            button1.clicked();
            button2.clicked();
            button3.clicked();
            button4.clicked();
            button5.clicked();
        }, 50);
    }).bind('mouseup mouseleave touchend', function () {
        $(this).removeClass('active');
        clearInterval(timeOut);
    });

});