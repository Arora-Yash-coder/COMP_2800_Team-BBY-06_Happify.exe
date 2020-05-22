$("#reg").on("click",()=>{
    window.location.href="/register"
})


$(".ui_choice").click((e)=>{

    console.log("e.target.id ")
    console.log(e.target.id.substring(10))
    let ui_choice = e.target.id.substring(10)
    $.ajax({
      type: "post",
      url: "/user_profile",
      data:{ui_choice},
      dataType: "text",
      success: function (response) {
        alert("Your Choice Will Be Effective for Other Pages When You Log In Next Time!!")
        // window.location.reload()
      }
    });
  })

  $("#ui_choice_1").click(()=>{
      $("#css").attr("href","/static/css/login1.css")

    })
    $("#ui_choice_0").click(()=>{
        $("#css").attr("href","/static/css/login.css")
    })