$(document).ready(function () {
            function say_hi() {
                $.get("/user_profile/getProfile", function (data, status) {
                    $("#username").html(data.result[0].username);
                    console.log("data.username===============")
                    console.log(data)
                });
            } say_hi()

        });

$(document).ready(function () {
            function show_points() {
                $.get("/user_profile/getProfile", function (data, status) {
                    let pointstoday = data.result[0].daily_task_rec[data.result[0].daily_task_rec.length - 1].points_earned_today
                    $("#pointsofar").html(data.result[0].points);
                    $("#pointofday").html(pointstoday);
                    console.log("data.result[0].daily_task_rec================");
                    ;
                });
            } show_points()

            
            $(".minigame").on("click", () => {
                let state_request = "I am ready to play a game"    
                $.ajax({
                    type: "post",
                    url: "/state_add",
                    data : {state_request},
                    dataType: "text",
                    success: function (response) {
                        window.location.replace('/coupon')
                    }
                });

            })

        });



        $("#proceed").click(() => {
            let state_request = "proceed button clicked";
            console.log(state_request)
            $.ajax({
                    type: "post",
                    url: "/state_add",
                    data : {state_request},
                    dataType: "text",
                    success: function (response) {
                        window.location.replace('/coupon')
                    }
                });

            


        })

        let allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            65: 'a',
            66: 'b'
        };

        let konamiCode = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
        let counter = 0;

        document.addEventListener('keydown', function (e) {
            let key = allowedKeys[e.keyCode];
            let requiredKey = konamiCode[counter];

            if (key == requiredKey) {
                counter++;

                if (counter == konamiCode.length) {
                    easter();
                    counter = 0;
                }
            } else {
                counter = 0;
            }
        });

        function easter() {
            window.location.href = '/static/minigames/agar.html';
        }







        