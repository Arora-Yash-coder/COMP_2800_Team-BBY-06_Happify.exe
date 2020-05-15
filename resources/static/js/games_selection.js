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
                $.ajax({
                    type: "get",
                    url: "/state_add",
                    dataType: "text",
                    success: function (response) {
                        console.log("successfully move onto the next state!")
                    }
                });

            })

        });



        $("#proceed").click(() => {

            alert("clicked")
            $.ajax({
                    type: "get",
                    url: "/state_add",
                    dataType: "text",
                    success: function (response) {
                        console.log("successfully move onto the next state!")
                    }
                });

            window.location.href = '/coupon';


        })
