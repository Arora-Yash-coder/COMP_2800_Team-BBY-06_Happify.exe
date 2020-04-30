$(document).ready(function () {

	// SUBMIT FORM
	$("#userForm").submit(function (event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});

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

	function ajaxPost() {

		// PREPARE FORM DATA
		var regInfo = {
			username: $("#username").val(),
			password: $("#password").val(),
			email: $("#email").val(),
			firstname: $("#firstname").val(),
			lastname: $("#lastname").val(),
			phoneno: $("#phoneno").val()

		}

		//register
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: "/api/users/register",
			data: JSON.stringify(regInfo),
			dataType: 'json',
			success: function (user) {
				$("#postResultDiv").html("<p>" +
					"Submitted Successfully! <br>" +
					"--> " + user.firstname + " " + user.lastname + "</p>");
				alert(user);
				setTimeout(() => {
					window.location.replace("./success")
				}, 2200);
			},
			error: function (e) {
				alert("Error!")
				console.log("ERROR: ", e);
			}
		});

		// Reset FormData after Posting
		resetData();

	}

	function resetData() {
		$("#username").val("");
		$("#password").val("");
		$("#email").val("");
		$("#firstname").val("");
		$("#lastname").val("");
		$("#phoneno").val("");
	}
})