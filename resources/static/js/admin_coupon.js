


        // <label class="todo-list__title" for="">id</label>
        //                 <input name="id"  class="to_do_items" id="id_1" type="text"> 
        //                 <label class="todo-list__title" for="">title</label>
        //                 <input name="title"  class="to_do_items" id="title_1" type="text"> 
        //                 <label class="todo-list__title" for="">description</label>
        //                 <input name="description"  class="to_do_items" id="description_1" type="text">
        //                 <label class="todo-list__title" for="">points</label>
        //                 <input name="points"  class="to_do_items" id="points_1" type="text"><br/> 




        let item_number = 2;

        $("#add_item").on("click", function () {
            let new_div = $("<div></div>");

            new_div.append("<label class='todo-list__title' for=id_" + item_number + "'>id </label>")
            new_div.append("<input name='id' id='id_" + item_number + "' type='text' class = 'to_do_items'>")
            new_div.append("<label class='todo-list__title' for=''>title</label>")
            new_div.append("<input name='title' class='to_do_items' id='title_" + item_number + "type='text'>")
            new_div.append("<label class='todo-list__title' for='description_'" + item_number + "'>description</label>")
            new_div.append("<input name='description'  class='to_do_items' id='description_" + item_number + "' type='text'>")
            new_div.append("<label class='todo-list__title' for='" + item_number + "' >points</label>")
            new_div.append("<input name='points'  class='to_do_items' id='points_" + item_number + "'  type='text'><br/> ")
            $("#items_to_submit").append(new_div)
            item_number++;
        })


        
        $("#delete").click(() => {

            var input_array = $(".checkboxes");
            
            var checked = []



            
            for(var index in input_array){
                let input_item = $(input_array[index]);
               
                if(input_item.prop("checked")){
                    console.log(input_item[0]["id"])
                    checked.push(input_item[0]["id"])
                }
               
               
            }
           
                console.log(checked)

            var update_info = [$("#target").val(), $("#newname").val()]
            console.log("--------------update_info")

           
            $.ajax({
                type: "post",
                url: "/coupon/delete",
                data:  {checked},
                dataType: "dataType",
                success: function (response) {
                   window.location.href = '/admin_coupon'
                },
                error:(e)=>{
                    window.location.href = '/admin_coupon'
                }
            });

            window.location.href = '/admin_coupon'
        })
