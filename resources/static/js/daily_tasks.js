

    function getTasks() {
      $.ajax({
        url: "/getDailyTasks",
        dataType: "json",
        type: "GET",
        success: function (data) {
          var div = $("#dailytask1");
          let seed = Math.floor(Math.random() * 11);

          let htmlStr = "";

          htmlStr += "<h3>Joke of the Day</h3><p>" + data.result[seed].content
            + "</p>";

          div.html(htmlStr);

          $("#dailytask1_id").html(data.result[seed].id)

          var div4 = $("#knowledge1");
          let seed2 = Math.floor(Math.random() * 11);

          $("#dailyknowledge1_id").html(data.result[seed2].id)
          let htmlStr2 = "";

          htmlStr2 += "<h3>Knowledge of the day</h3><p>" + data.result[seed2].content
            + "</p>";

          div4.html(htmlStr2);



        },
        error: function (jqXHR, textStatus, errorThrown) {
          $("#p1").text(textStatus + " " + errorThrown
            + jqXHR.responseText);
        }
      });
    }

    $("#dailytask_dislike").on("click", () => {
      let id = $("#dailytask1_id").html()

      $.ajax({
        type: "post",
        url: "/getDailyTasks/dislikeTask",
        data: { "id": id },
        dataType: "dataType",
        success: function (response) {
          alert("thx 4 ur feedbck")
        }
      });
    })

    $("#knowledge_like").on("click", () => {
      let id = $("#dailyknowledge1_id").html()

      $.ajax({
        type: "post",
        url: "/getDailyTasks/likeKnowledge",
        data: { "id": id },
        dataType: "dataType",
        success: function (response) {
          alert("thx 4 ur feedbck")
        }
      });
    })


    $("#knowledge_dislike").on("click", () => {
      let id = $("#dailyknowledge1_id").html()

      $.ajax({
        type: "post",
        url: "/getDailyTasks/dislikeKnowledge",
        data: { "id": id },
        dataType: "dataType",
        success: function (response) {
          alert("thx 4 ur feedbck")
        }
      });
    })

    $(".hiddenID").hide()

    var d = new Date()
    var date = d.getDate();
    var day = d.getDay();
    var month = d.getMonth();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    var now = Date.now();


    $.ajax({
      type: "post",
      url: "/check_time",
      data: { d },
      dataType: "json",
      success: function (response) {
        alert(response)
      }
    });

    $(".answer_choices").hide()



    $(".to_do_title").click((e) => {

      let length = $(".taskid").length
      let taskid = $(".taskid")
      console.log("taskid")
      console.log(taskid)
      let id_array = []


      for (var each = 0; each < length; each++) {
        // id_array.push(titles[each].id.substring(6)) 
        id_array.push(parseInt(taskid[each].id.substring(6)))
      }
      console.log("--------------------------id_array")
      console.log(id_array)

      $.ajax({
        type: "post",
        url: "/daily_tasks",
        data: { id_array },
        dataType: "text",
        success: function (response) {
          //  alert(response)
        }
      });


      // $("#" + e.target.parentNode.id + " ~ div > span ~  ").css("display", "none")
      // $("#" + e.target.parentNode.id + " ~ div > span ~   ").css("display", "none")

      // $("#" + e.target.id + " ~ *").toggle()

      // if ($("#" + e.target.id + " ~ div > div > button").css("display", "none")) {
        setTimeout(() => {

          $("#" + e.target.id + " ~ div button").show()
        }, 3000);
      // } else {
      //   $("#" + e.target.id + " ~ div > div > button").css("display", "none")
      // }

    })

    $("button").click((e) => {

      if ($(e.target).html() == e.target.parentElement.id) {
        $.ajax({
          type: "get",
          url: "/state_add",
          dataType: "text",
          success: function (response) {
            window.location.reload();
          }
        });

        $.ajax({
          type: "get",
          url: "/add_points",
          data: "data",
          dataType: "text",
          success: function (response) {
            alert(response)
          }



        });

        $.ajax({
          type: "get",
          url: "/state_add",
          dataType: "text",
          success: function (response) {
            console.log("successfully move onto the next state!")
          }
        });






      } else if ($(e.target).html() == "Proceed") {
        e.preventDefault
      }
      // else { alert("This is wrrrrong!") }
    })



    $(document).ready(function () {



      $.ajax({
        type: "get",
        url: "/user_profile/getProfile",

        dataType: "json",
        success: function (response) {

          $("#show_points").html("Current Points:" + response.result[0].points)
        },
        error: (response) => {
          console.log("failed")

        }
      });
    });

    $("#proceed").click(() => {

      alert("clicked")
      $.ajax({
        type: "get",
        url: "/state_add",

        dataType: "text",
        success: function (response) {
          alert(response)
          window.location.href = '/minigames';
        }
      });
    })