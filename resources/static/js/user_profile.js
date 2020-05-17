 //=====================upload==========avatar====================
    $(document).ready(function () {



      $(".avatar").on("click", () => {
        document.getElementById("upload").click();

      })
      //local Storage reads the attribute "picture" to the document.

      var pictureSrc = window.localStorage.getItem("picture");
      if (pictureSrc) {
        $('#avatar').attr('src', pictureSrc);
      }else{
        $('#avatar').attr('src', "/img/avatar.png");
      }

      //regex that would allow the browse function to work.
      $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
          label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [label]);
      });

      $('.btn-file :file').on('fileselect', function (event, label) {

        var input = $(this).parents('.input-group').find(':text'),
          log = label;

        if (input.length) {
          input.val(log);
        } else {
          if (log) alert(log);
        }

      });






      //the function reads the URL to the picture.
      function readURL(input) {


        var reader = new FileReader();

        reader.onload = function (e) {
          pictureSrc = e.target.result;
          $('#avatar').attr('src', pictureSrc);
          /*this line of code is crucial, if it is put outside
          of the the function(e){} callback, then the memory function
          would not work*/
          localStorage.setItem("picture", pictureSrc);

        }
        // localStorage.setItem("picture", pictureSrc);
        reader.readAsDataURL(input.files[0]);
      }

      //After some picture is upload, the page reads the new URL
      $(".avatar").change(function (e) {
        $("#submit").click();
        e.preventDefault();
        console.log(this.files[0]);
        console.log(readURL(this));
      });
    });
    //       reader.readAsDataURL(input.files[0]);





    //=====================upload==========avatar====================


    //======================UPDATE======INFO

    $("#save").click(() => {
      let usernameinput = $("#usernameinput").val()
      let passwordinput = $("#passwordinput").val()
      let firstnameinput = $("#firstnameinput").val()
      let lastnameinput = $("#lastnameinput").val()
      let emailinput = $("#emailinput").val()
      let phonenoinput = $("#phonenoinput").val()

      let data = {
        username: usernameinput,
        password: passwordinput,
        email: emailinput,
        phoneno: phonenoinput,
        firstname: firstnameinput,
        lastname: lastnameinput
      }
      console.log(data)

      $.ajax({
        type: "post",
        url: "/user_profile/setProfile",
        data: data,
        dataType: "text",
        success: function (response) {
          console.log(response)
          setTimeout(() => {
            window.location.href = "/homepage"
          }, 300);
        }
      });
    })











    $.ajax({
      url: "/user_profile/getProfile",
      dataType: "json",
      type: "GET",
      success: function (data) {
        let usernameinput = $("#usernameinput").val()
      let passwordinput = $("#passwordinput").val()
      let firstnameinput = $("#firstnameinput").val()
      let lastnameinput = $("#lastnameinput").val()
      let emailinput = $("#emailinput").val()
      let phonenoinput = $("#phonenoinput").val()




        //USERNAME
        var div_usrname = $("#username");
        var text_usernameinput = $("#usernameinput");

        let username = "" + data.result[0].username;
        $("#usernameinput").val(username)

        //PASSWORD
        var div_password = $("#password");

        var text_passwordinput = $("#passwordinput");
        let htmlStr2 = "";
        let password = "" + data.result[0].password;
        $("#passwordinput").val(password)

        //FIRSTNAME
        var div_firstname = $("#firstname");
        var text_firstnameinput = $("#firstnameinput");

        let firstname = "" + data.result[0].firstname;
        $("#firstnameinput").val(firstname)

        //LAST NAME
        var div_lastname = $("#lastname");

        var text_lastnameinput = $("#lastnameinput");
        let htmlStr5 = "";
        let lastname = "" + data.result[0].lastname;
        $("#lastnameinput").val(lastname)

        //EMAIL
        var div_email = $("#email");
        var text_emailinput = $("#emailinput");

        let htmlStr3 = "";
        let email = "" + data.result[0].email;
        $("#emailinput").val(email)

        //PHONE
        var div_phoneno = $("#phoneno");
        var text_phonenoinput = $("#phonenoinput");


        let htmlStr6 = "";
        let phoneno = "" + data.result[0].phoneno;
        $("#phonenoinput").val(phoneno)

      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#p1").text(textStatus + " " + errorThrown
          + jqXHR.responseText);
      }
    });

    $("#mycoupons").click(() => {
      window.location.href = "/my_coupons"
    })

    $("#logout").click(() => {
      window.location.href = "/logout";
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
          window.location.reload()
        }
      });
    })


    