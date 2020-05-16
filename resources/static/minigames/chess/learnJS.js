        /*discover the similarities*/
        
        // $(div).on("mouseleave", () => {
        // 	console.log(cell.get_x_coor() + " " + cell.get_y_coor());
        // 	$(div).css("background-color","green")
        // })


                // $(window).mousedown("click", () => {
        // 	$(div).css("background-color",cell.color)
        // 	console.log(cell.get_x_coor() + " " + cell.get_y_coor());
        // 	if(this.piece != null){
        // 		this.piece.move_pattern();
        // 	}
        // })


        
        // for(let z=0; z<document.getElementsByTagName("img").length;z++)
      // document.getElementsByTagName("img")[z].onmousedown = function(e){
        // 	e.preventDefault();
        // }


                // $(div).on("mouseleave", () => {
        // 	console.log(cell.get_x_coor() + " " + cell.get_y_coor());
        // 	$(div).css("background-color","green")
        // })

        // $(window).mousedown("click", () => {
        //     //now the current cell is 
        //     cell.board.prev_cell;
        //     cell.board.prev_cell.get_piece();

        // })

                    //之前没有按过棋子,现在也没有按
                    if(!cell.piece && (!cell.board.prev_cell  || !cell.board.prev_cell.piece)  ){
                        console.log("the player clicked on " + cell.get_x_coor()+"   " + cell.get_y_coor())
                    }
        

                    //没有按过棋子，现在按棋子了
                    if(cell.piece){
                        //之前有按过格子，看看那个格子有没有棋子
                        if(cell.board.prev_cell){
                            //如果之前格子里没有棋子
                            if(!cell.board.prev_cell.piece){
                            //现在就是选中棋子的状态
                            console.log("the player chose "+cell.piece.piece_name +" in grid "+cell.get_x_coor()+" " +cell.get_y_coor())
                            }
                        }
                    }
