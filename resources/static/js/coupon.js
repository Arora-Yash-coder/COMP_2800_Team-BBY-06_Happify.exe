




$("#search").on("click", () => {
    var serach_box = $("#search_box").val();
    console.log("serach_box")
    console.log(serach_box)
    console.log($("#search_box").val())
    $.ajax({
        type: "post",
        url: "/coupon/search",
        data: { serach_box },
        dataType: "html",
        success: function (response) {
            console.log("response")
            console.log(response)
            $("html").html(response)
        },
        error: (e) => {
            console.log(e)
        }
    });
})







$.ajax({
    type: "get",
    url: "/user_profile/getProfile",

    dataType: "json",
    success: function (response) {
        console.log(response)
        console.log(response.result[0].points)
        $("#current_points").html(response.result[0].points)
    },
    error: (response) => {
        console.log(response)

        alert(response.points)
    }
});

let itemArr = $(".coupons");
console.log(itemArr[0]);
// for(var nodeIndex in )
$(".confirm").hide();


let coupon_info = null;
let confirm_choice = null;
let node_id = 0;
$(".coupon").click(function (e) {

    // const coupon_display = 

    const confirmation_selection = " <h1>Confirm?</h1></div><div id='selection'><a class='square_btn_second'>Yes</a><a class='square_btn_second'>No</a>"
    if (e.target && (e.target.nodeName == "H1" || e.target.nodeName == "P" || e.target.nodeName == "SPAN")) {
        coupon_info = $("#" + e.target.parentNode.id)
        node_id = e.target.parentNode.id.substr(7)

        // alert(node_id)
    } else {
        coupon_info = $("#" + e.target.id)
        node_id = e.target.id.substr(7)
        // alert(node_id)
    }
    confirm_choice = $("#confirm_" + node_id)
    confirm_choice.toggle()
    $("#description_" + node_id).toggle();
    // node_to_change.html(confirmation_selection)

});

$(".no").click((e) => {
    console.log(confirm_choice)
    confirm_choice.toggle()
    $("#description_" + node_id).toggle();
})

$(".yes").click((e) => {
    redeem_id = $(e.target).attr("name");

    //redeem a coupon, the coupon is now available in my_profile page
    $.ajax({
        type: "post",
        url: "/coupon/redeem",
        data: { "id": redeem_id },
        dataType: "text",
        success: function (response) {
            alert(response)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }

    })


    $.get("/user_profile/getProfile", function (data, status) {
        $("#username").html(data.result[0].username);
        console.log("data.username===============")
        console.log(data)
    });




    $("#back").click(() => {
        window.location.href = "/minigames"
        $.ajax({
            type: "get",
            url: "/state_minus",
            dataType: "text",
            success: function (response) {
                console.log("successfully move onto the last state@@!")
                window.location.href = "/minigames"
            }

        });
        window.location.href = "/minigames"
    })





    // setTimeout(() => { window.location.replace('/coupon') }, 120);
});



$("#proceed").click(() => {

    let state_request = "proceed button clicked in STEP 6";
    console.log(state_request)
    $.ajax({
        type: "post",
        url: "/state_add",
        data: { state_request },
        dataType: "text",
        success: function (response) {
            window.location.replace('./flow_final.html')

        }
    });
})

