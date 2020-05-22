$("#start_reminder").hide()
        $("#cancel_reminder").hide()

        $("#start_reminder").click(() => {
            $("#start_reminder").hide()
            $("#cancel_reminder").show()
        })

        $("#cancel_reminder").click(() => {
            $("#start_reminder").show()
            $("#cancel_reminder").hide()
        })




        function set_notification_time() {


            var hour = document.getElementById("hour").value;
            var mintue = document.getElementById("minute").value;
            var remind_time = {
                "hour": hour,
                "minute": mintue
            }
            $.ajax({

                type: "post",
                url: "/subscribe",
                data: remind_time,
                dataType: "text",
                // contentType: "app/json",
                success: function (response) {
                    alert("Your reminder time has already set! Click on the Start Button to confirm!")

                }
            });


            document.getElementById("time").innerHTML = hour + ":" + mintue;
        }

        $("#confirm_time").click(() => {
            $("#start_reminder").show()
            $("#confirm_time").hide()
        })


        // TESTED AVAILABLE CODE:
        //THIS IS A GLOBAL VARIABLE
        let publicKey = null
        //WHEN THE WINDOWS IS LOADED, REGISTER THE SERVICE WORKER
        addEventListener('load', async () => {
            //REGISTER THE SERVICE WORKER
            let sw = await navigator.serviceWorker.register('/sw.js'
                // , {scope: 'futurecurves.ca/'}
            )
            console.log(sw)
            //GET A NEW VAPID API KEY 
            newAPIkey()
        })





        function newAPIkey() {
            $.ajax({
                type: "get",
                url: "/subscribe",
                dataType: "json",
                success: function (response) {
                    publicKey = response.publicKey
                    console.log(publicKey)

                }
            });
        }


        async function subscribe() {
            let sw = await navigator.serviceWorker.ready;
            //pushed to the browser
            let push = await sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            })

            console.log(JSON.stringify(push))
            return JSON.stringify(push);


        }
        //send stringified json to /post
        async function submit() {
            console.log("submit")
            subscribe().then((push) => {
                console.log("submit")
                console.log(push)
                $.ajax({
                    type: "post",
                    url: "/push",
                    data: {
                        push
                    },
                    dataType: "text",
                    success: function (response) {
                        alert(response)
                        $("#cancel_reminder").show()
                        $("#confirm_time").hide()
                    },
                    error: () => {
                        navigator.serviceWorker.getRegistrations().then(function (
                        registrations) {
                            for (let registration of registrations) {
                                registration.unregister();
                            }
                        })
                    }
                });
            })
        }


        function unregister() {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister({
                        immediate: true
                    });
                }
            }).then(() => {
                window.location.reload();
            })
        }
    </script>
    <script>
        // When the user scrolls the page, execute myFunction
        window.onscroll = function () {
            myFunction()
        };

        // Get the navbar
        var navbar = document.getElementById("nav");

        // Get the offset position of the navbar
        var sticky = navbar.offsetTop;

        // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
        function myFunction() {
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky")
            } else {
                navbar.classList.remove("sticky");
            }
        }