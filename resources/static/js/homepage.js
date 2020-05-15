$(document).ready(function () {
                    function say_hi() {
                        $.get("/user_profile/getProfile", function (data, status) {
                            $("#username").html(data.result[0].username);
                            console.log("data.username===============")
                            console.log(data)
                        });
                    } say_hi()

                });