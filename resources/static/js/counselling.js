
            // When the user scrolls the page, execute myFunction
            window.onscroll = function () { myFunction() };

            // Get the navbar
            var navbar = document.getElementById("navbar");

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

             //card 1_2 related hide and show functions
            $(".card1_1,.hide").hide()
            $("#card1_2").hide()
            $("#card1_1").click(()=>{
                 $("#card1_2").toggle() 
                 $("#card1_1_hide").toggle()
                 $("#card1_1_expand").toggle()
            })

            //card 1_4 related hide and show functions
            $("#card1_4").hide()
            $("#card1_3").click(()=>{
                 $("#card1_4").toggle() 
                 $("#card1_3_hide").toggle()
                 $("#card1_3_expand").toggle()
            })


            $("#proceed_button").click(()=>{
                window.location.href="/chatbox"
            })

            setTimeout(() => {
                $("#coupert-ext").hide()
            }, 1000);



           
