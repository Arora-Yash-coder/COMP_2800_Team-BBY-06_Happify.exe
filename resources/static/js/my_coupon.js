$(document).ready(function () {
            function show_points() {
                $.get("/user_profile/getProfile", function (data, status) {
                   let pointstoday = data.result[0].daily_task_rec[data.result[0].daily_task_rec.length-1].points_earned_today
                   console.log("data.result[0].daily_task_rec================");
                   console.log(pointstoday);
                   $("#pointsofar").html(data.result[0].points);
                    $("#pointofday").html(pointstoday);
                   
                    ;
                });
            } show_points()

        });
 // $(document).ready(function () {
                //     function say_hi() {
                //         $.get("/user_profile/getProfile", function (data, status) {
                //             $("#username").html(data.result[0].username);
                //             console.log("data.username===============")
                //             console.log(data)
                //         });
                //     } say_hi()

                // });