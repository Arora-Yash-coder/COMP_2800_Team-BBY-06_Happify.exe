    // When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the navbar
var navbar = document.getElementById("navbar");

// Get the offset position of the navbar
var sticky = navbar.offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

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

          

        });



 var user = null;
        var days = []
        var points_arr = []
        async function getData() {
            let get_data = await $.ajax({
                type: "get",
                url: "/record",

                dataType: "json",
                success: function (response) {
                    user = response
                    daily_task = user["daily_task_rec"];

                    for (var i in daily_task) {
                        days.push("day " + daily_task[i].day)
                        points_arr.push(daily_task[i].points_earned_today)
                    }

                }
            });


        }

        //line chart
        async function drawGraph() {
            new Chart(document.getElementById("line-chart"), {
                type: 'line',
                data: {
                    //days
                    labels: days,

                    datasets: [{
                        data: points_arr,
                        label: "USER POINTS",
                        borderColor: "#3e95cd",
                        fill: true
                    },
                        // {
                        // 	data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                        // 	label: "Coupons Redeemed",
                        // 	borderColor: "#3e95cd",
                        // 	fill: false
                        // }, 

                    ]
                },
                options: {
                    title: {
                        display: true,
                        text: 'User Record'
                    }
                }
            });


            //radar chart
            new Chart(document.getElementById("radar-chart"), {
                type: 'radar',
                data: {
                    labels: ["Multi-Tower", "TicTacToe", "Zombie", "Snake Eater", "Chess"],
                    datasets: [
                        {
                            label: "Time Of Play",
                            fill: true,
                            backgroundColor: "rgba(179,181,198,0.2)",
                            borderColor: "rgba(227,71,43,1)",
                            pointBorderColor: "#fff",
                            pointBackgroundColor: "rgba(179,181,198,1)",
                            data: [15, 15, 15, 15, 10]
                        }, {
                            label: "Points Earned",
                            fill: true,
                            backgroundColor: "rgba(255,99,132,0.2)",
                            borderColor: "rgba(10,2,31,1)",
                            pointBorderColor: "#fff",
                            pointBackgroundColor: "rgba(255,99,132,1)",
                            pointBorderColor: "#fff",
                            data: [10, 20, 5, 10, 10]
                        }
                    ]
                },
                options: {
                    title: {
                        display: true,
                        // text: 'Distribution in % of world population'
                    }
                }
            });





        }

        getData().then(() => {
            drawGraph()
        })

        $(".choice_btn").click((e) => {
            $(e.target.parentNode.parentNode).css("display", "none")
            $(e.target.parentNode.parentNode).css("height", "0")
            $(e.target.parentNode.parentNode).remove()
        })

