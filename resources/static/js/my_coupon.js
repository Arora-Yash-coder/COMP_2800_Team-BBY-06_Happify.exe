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