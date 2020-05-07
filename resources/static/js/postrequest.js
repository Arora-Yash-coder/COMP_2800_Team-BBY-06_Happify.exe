

$(document).ready(function () {
	// Cookies.set({user_sid:"1"})


	$("#login").on("click", function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		
		ajaxCompare();
	});

	//login
	function ajaxCompare() {
		var loginData = {
			username: $("#username").val(),
			password: $("#password").val()
		}

		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/api/users/verify",
			data: JSON.stringify(loginData),
			dataType: 'html',
			success: function (msg) {
				// alert(msg)
				if (msg == "password not correct") {
					alert("password not correct")
					// window.location.href="/login"
				}
				else if (msg == "username not found") {
					alert("username not found")

				} else {
					alert("login successful")
					$("html").html(msg)
				}

			},
			error: function (e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});

	}


})