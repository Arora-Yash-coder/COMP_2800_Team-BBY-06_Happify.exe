var user = null;
		var days  = []
		var points_arr = []
		async function getData(){
		let get_data = await $.ajax({
			type: "get",
			url: "/record",
		
			dataType: "json",
			success: function (response) {
				user = response
				daily_task = user["daily_task_rec"];
				
				for(var i in daily_task){
					days.push( "day "+daily_task[i].day)
					points_arr.push(daily_task[i].points_earned_today)
				}

			}
		});

	
	}

	async function drawGraph(){
		new Chart(document.getElementById("line-chart"), {
			type: 'line',
			data: {
				//days
				labels: days,
				
				datasets: [{
					data: points_arr,
					label: "USER POINTS",
					borderColor: "#3e95cd",
					fill: true
				}, 
				// {
				// 	data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
				// 	label: "Coupons Redeemed",
				// 	borderColor: "#3e95cd",
				// 	fill: false
				// }, 
				
				]
			},
			options: {
				title: {
					display: true,
					text: 'User Record'
				}
			}
		});
	}

	getData().then(()=>{
		drawGraph()
	})
