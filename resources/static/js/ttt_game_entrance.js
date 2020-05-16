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
                            $("#pointsofar").html(data.result[0].points);
                            $("#pointofday").html(data.result[0].daily_task_rec[0].points_earned_today);
                            console.log("data.total===============");
                            console.log(data);
                        });
                    } show_points()

                });