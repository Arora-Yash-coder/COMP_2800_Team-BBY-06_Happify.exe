$( document ).ready(function() {
	
	// SUBMIT FORM
    $("#login").on("click",function(event) {
		// Prevent the form from submitting via the browser.
		event.preventDefault();
		ajaxPost();
	});
    
    
    function ajaxPost(){
    	
    	// PREPARE FORM DATA
    	var formData = {
			username : $("#username").val(),
			password : $("#password").val()
    	}
    	
    	// DO POST
    	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "/api/users/verify",
			data : JSON.stringify(formData),
			dataType : 'json',
			success : function(user) {
				$("#postResultDiv").html("<p>" + 
					"verified Successfully! <br>" +
					"--> </p>");

					// setTimeout(() => {
					// 	window.location.replace("./success")
					// }, 2200);
			},
			error : function(e) {
				alert("Error!")
				console.log("ERROR: ", e.message);
			}
		});
    	
    	// Reset FormData after Posting
    	resetData();
 
    }
    
    function resetData(){
		$("#username").val("");
		$("#password").val("");
		$("#email").val("");
    	$("#firstname").val("");
		$("#lastname").val("");
		$("#phoneno").val("");
    }
})