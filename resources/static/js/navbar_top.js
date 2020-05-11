$(document).ready(function () {
    $.ajax({
        type: "get",
        url: "/user_profile/getProfile",
        
        dataType: "json",
        success: function (response) {
            console.log(response.result[0].points)
            $("#show_points").html(response.result[0].points)
        },
        error:(response)=>{
            console.log(response)
           
            alert(response.points)
        }
    });
});