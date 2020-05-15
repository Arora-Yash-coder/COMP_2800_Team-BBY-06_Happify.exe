

    function getTasks() {
      console.log("data")
      $.ajax({
        url: "/getDailyTasks",
        dataType: "json",
        type: "GET",
        success: function (data) {
          console.log(data)
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
    } getTasks()

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


    $("button").click((e) => {
      console.log(e.target.parentElement.id)
      console.log($(e.target).html())
      console.log(typeof $(e.target).html())
      console.log(typeof e.target.parentElement.id)
      console.log($(e.target).html() == e.target.parentElement.id)
      if ($(e.target).html() == e.target.parentElement.id) {
        alert("right")
      }else{
        alert("wrong")
      }
    })

    //checks time per second
    // setInterval(() => {
    //   d = new Date()
    //   date = d.getDate();
    //    day = d.getDay();
    //    month = d.getMonth();
    //    sec = d.getSeconds();
    //    console.log("date")
    //   console.log(date)
    //   console.log("day")
    //   console.log(day)
    //   console.log("month" + month)
    //   console.log("min" + min)
    //   console.log("sec" + sec)
    // }, 1000);
