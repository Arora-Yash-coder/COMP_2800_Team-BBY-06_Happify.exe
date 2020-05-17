//contains all the properties that a cell needs
class Linker {
    constructor(obj, html) {
        this.obj = obj;
        this.html = html;
        this.html.obj = obj;
        this.obj.html = html;

    }

}
//the available cells to go in
var avail;





//A class that stores all the information
class Cell {
    constructor(size, x_coor, y_coor, color, board) {
        //width of the square
        this.color = color;
        this.size = 80;
        this.x_coor = x_coor;
        this.y_coor = y_coor;
        this.id = [this.x_coor, this.y_coor];
        this.size = size;
        this.piece = null;
        this.html;
        this.board = board;
    }

    // returns the piece
    get_piece() {
        return this.piece;
    }

    //setter method to set the piece in a cell
    set_piece(piece) {
        this.piece = piece
    }

    //returns the x_coor
    get_x_coor() {
        const x_coor = ['a','b','c','d','e','f','g','h']
        return x_coor[this.x_coor-1];
    }

    //returns the y_coor
    get_y_coor() {
        return this.y_coor;
    }

    /*the method takes in a cell and then renders the
      cell's html elements and add event listeners to it  
    */
    cell_render(cell) {

        
        let div = $("<div></div>");

        //nice little invention, a connector between the object 
        //and the html elements, see constructor of Linker class 
        //for some more details
        let linker = new Linker(cell, div);
        // console.log( linker)

        //set the cell to the size we specified
        $(div).css("display", "inline-block");
        $(div).css("width", cell.size + "px");
        $(div).css("height", cell.size + "px");
        //change the colour to the specified colour in the constructor
        $(div).css("background-color", cell.color);



        
        //一、 每次点击一个[格子]的时候，看看选的这个格子里有没有[棋子]
        //     I. 如果没有那就什么都不做，只是console.log(<坐标>) ==>可以和{二、I}合并
                    
        //     II.如果有棋子                                     ==>可以和{二} 同时进行
        //               1.就会看看是否上一步有点击过这个格子
        //               2.检查现在是到哪一方走，如果是另一方的棋子不能选
 
        function check_selected(){}

        //二、 检查上一步是否点击过这个[格子]，
        //     I. 如果有的话，就什么都不做                        ==> 可以和{一、I}合并

        //     II.没有点击过这个格子的话，就判断
        //        1.有没有选中过这个棋子
        //           (1)没有：让这个格子里的棋子变成选中的棋子（结束）
        //           (2)  有：判断这个格子里的棋子的颜色是否和之前那个一样
        //                   a.  颜色一样，让这个格子里的棋子变成选中棋子（结束）
        //                   b.  颜色不同，调用吃子函数  
        //                       （吃子方法：把棋子移走, 然后take_turns()换下一方走）
        //      二、        


        function check_clicked(){
            
            //之前没有按过棋子,现在也没有按
            if(!cell.piece && (!cell.board.selected_piece)  ){
                console.log("the player clicked on " + cell.get_x_coor()+"   " + cell.get_y_coor())
            }
            //没有按过棋子，现在按棋子了
            else if(!cell.board.selected_piece && cell.piece){
                //可行性提示
                
                //如果棋子原来的颜色和现在该走的颜色不一样的话，
                if(cell.piece && cell.piece.color != cell.board.cur_player){
                    alert("you cannot move this piece!轮到另外一方走了")
                }
                //如果棋子颜色是该走的那个
                else{
                    avail = cell.piece.move_pattern();

                    cell.board.selected_piece = cell.piece;
                    
                    console.log("the player chose "+cell.piece.piece_name +" in grid "+cell.get_x_coor()+" " +cell.get_y_coor())
                    console.log(cell.board.selected_piece)
                }
               
            }
            

            //按过棋子
            else if(cell.board.selected_piece){
                
                //但是现在这个格子没有棋子

                
                
                if(!cell.piece){
                    //获取可走的格子
                avail = cell.board.prev_cell.piece.move_pattern();
                //判断按的地方是否可走
                    for(const i in avail){
                        if(avail[i] == cell){
                            let uci ={"stdio?":"yes"}
                    let cur_pos = cell.board.selected_piece.cell.get_x_coor() + cell.board.selected_piece.cell.get_y_coor();
                    let next_pos = cell.get_x_coor() + cell.get_y_coor();

                    console.log("the player wants to move the piece from " + cur_pos + " to " + next_pos)
                    
                   
                    take_out(cell.board.selected_piece.cell,cell);
                    take_turns()
                    uci=cur_pos+next_pos;
                    setTimeout(() => {
                        console.log({"uci":uci})
                        $.ajax({
                            type: "post",
                            url: "/minigames/chess",
                            data: {"uci":uci},
                            // dataType: "dataType",
                            success: function (response) {
                                console.log("get_cell_by_uci");
                                let from_cell = cell.board.get_cell_by_uci(response.substring(0,1),response.substring(1,2))
                                //  from_cell = response.substring(0,2)
                                let to_cell = cell.board.get_cell_by_uci(response.substring(2,3),response.substring(3,4))
                                console.log(response);
                                console.log("from_cell===================================");
                                console.log( from_cell);
                                console.log("to_cell  ===================================")
                                console.log(to_cell)
                                from_cell.board.selected_piece = from_cell.piece;
                                take_out(from_cell,to_cell);
                                take_turns()
                            }
                        });
                    }, 100);
                            
                        }else{console.log("choose another cell to move in")}
                    }
                    
                }
  
                //按的这个格子的棋子和之前的是同一个颜色的，所以就换成那个颜色继续走
                else if(cell.piece.color == cell.board.selected_piece.color){
                    
                    avail = cell.piece.move_pattern();

                    cell.board.selected_piece = cell.piece;
                    console.log("so the user wants to select another piece to move")}
                //按的这个格子的棋子和之前的是不同颜色的，所以就触发吃子事件
                else if(cell.piece.color != cell.board.selected_piece.color){
                    let uci ={"stdio?":"yes"}
                    let cur_pos = cell.board.selected_piece.cell.get_x_coor() + cell.board.selected_piece.cell.get_y_coor();
                    let next_pos = cell.get_x_coor() + cell.get_y_coor();

                    take_out(cell.board.selected_piece.cell,cell)
                    take_turns()
                    uci=cur_pos+next_pos;
                    setTimeout(() => {
                        console.log({"uci":uci})
                        $.ajax({
                            type: "post",
                            url: "/minigames/chess",
                            data: {"uci":uci},
                            // dataType: "dataType",
                            success: function (response) {
                                console.log("get_cell_by_uci");
                                let from_cell = cell.board.get_cell_by_uci(response.substring(0,1),response.substring(1,2))
                                //  from_cell = response.substring(0,2)
                                let to_cell = cell.board.get_cell_by_uci(response.substring(2,3),response.substring(3,4))
                                console.log(response);
                                console.log("from_cell===================================");
                                console.log( from_cell);
                                console.log("to_cell  ===================================")
                                console.log(to_cell)
                                from_cell.board.selected_piece = from_cell.piece;
                                take_out(from_cell,to_cell);
                                take_turns()
                            }
                        });
                    }, 100);

                    console.log("triggers take_out() event")
                }    

            }
        }



        function take_out(active,passive){
            
            //clear everything in the div 
            
   
            if(active.piece.color=="white")
                $(passive.html).html(active.board.selected_piece.piece_render("white",passive.get_x_coor(),passive.get_y_coor())); 
            else
                $(passive.html).html(active.board.selected_piece.piece_render("black",passive.get_x_coor(),passive.get_y_coor()));
            
            $(active.html).html(""); 
            passive.piece = active.piece;
            active.piece = null;
            passive.piece.cell = passive;
            passive.board.selected_piece = null;

        }

        function take_turns(){
            //if the selected piece is black,
            if(cell.board.cur_player == "black"){
                cell.board.cur_player ="white";
                active_white()
            }
            else if (cell.board.cur_player == "white"){
                cell.board.cur_player ="black";
                active_black()
            }
            console.log("turns taken by" + cell.board.cur_player)
        }



        //the mouse is pressed 
        $(linker.html).mousedown(() => {
            check_clicked()
            //the grid becomes green because you have clicked on it
            $(div).css("background-color", "green")
            cell.board.prev_cell = cell;

        })


        //now when the background color goes back to normal when the mouse moves up
        $(div).mouseup(() => {
            $(div).css("background-color", cell.color)
        })



        $("#board_container").append(div);
        return div;
    }


    cell_render_available(cell) {
        let div = $("<div></div>");
        $(div).css("display", "inline-block");
        $(div).css("width", cell.size);
        $(div).css("height", cell.size);
        $(div).css("background-color", "blue");




        //the color goes back by fetching the color property from the cell
        //set it back as the background colour of the div
        $(window).mouseup(() => {
            $(div).css("background-color", cell.color)
        })


        $(cell.html).html(div);
        return div;
    }


}



//col
class Board {
    constructor() {
        //the current player
        this.cur_player = "white";
        //the current chosen piece
        this.selected_piece = null;
        //the previously chosen cell
        this.prev_cell = null;
        //cells to hold all cells in this board
        this.cells = [];
    }

    create_board() {
        for (let j = 8; j >= 1; j--) {
            //row
            this.cells[j] = []
            for (let i = 1; i <= 8; i++) {
                //if even then white 
                if ((i + j) % 2 == 0) {
                    //the "this" creates a connection between the
                    //cell and the board.
                    var cell = new Cell(120, i, j, "grey", this)
                } else {
                    var cell = new Cell(120, i, j, "beige", this)
                }
                //put into the index i,j 
                this.cells[j][i] = cell;

                // cell.cell_render(cell);
                this.cells[j][i].html = cell.cell_render(cell);
            }

        }
    }

    //note that the x and y are in reversed position
    //in the return statement
    get_cell(x, y) {
        return this.cells[y][x];
    }

    get_cell_by_uci(x, y) {
        const x_coor = {'a':1,
        'b':2,
        'c':3,
        'd':4,
        'e':5,
        'f':6,
        'g':7,
        'h':8}

        return this.cells[y][x_coor[x]];
    }


}




//Super Class for Pieces
class Piece {
    constructor(piece_name, board, x_coor, y_coor) {
        this.board = board;
        this.piece_name = piece_name;
        this.selected = false;
        this.active = false;
        this.img;
        this.color;
        this.cell = this.board.get_cell(x_coor, y_coor);
        this.cell.set_piece(this);
    }


    move(target_cell) {
        this.board.prev_cell.piece.selected = false;
    }


    //returns the cell
    piece_get_cell() {
        return this.cell;
    }

    piece_set_cell(some_cell) {
        this.cell = some_cell;
    }

    //renders the piece to the board 
    piece_render(color, x_coor, y_coor) {
        console.log(x_coor);

        let this_cell = this.cell;
        this_cell.set_piece(this);



        let innerhtml = "<img class='piece_imgs' src=" + "'" + this.img + "'" + "></img>";
        $(this_cell.html).html(innerhtml);
        //make the pictures impossible to drag by using prevent default
        $(this_cell.html).mousedown((e) => { e.preventDefault() })
        return innerhtml;

    }

    //make the piece in cell (x_coor,y_coor) disappear
    piece_reverse_render(x_coor, y_coor) {
        $(this_cell.html).html(this_cell.cell_render());
    }
}





//Pawn Class is the model for the painful straight forward soldiers
class Pawn extends Piece {
    //now look at the constructor it reads in four parameters
    constructor(color, board, x_coor, y_coor) {

        super("pawn_" + color, board, x_coor, y_coor);

        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_Pawn.png"
        else
            this.img = "/minigames/chess/resources/img/Black_Pawn.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }


    //move pattern for pawns
    move_pattern(color) {
        let movable_squares = [];
        let forward = 0;
        let init_row = 0;
        let compare = null;

        if (this.color == "white") {
            forward = 1;
            init_row = 2;
        }
        else if (this.color == "black") {
            forward = -1;
            init_row = 8 - 2;
        }

        function move_remder(board, cell) {

            let div = board.get_cell(cell.x_coor, cell.y_coor + forward);
            div.html = div.cell_render_available(div);
            div = board.get_cell(cell.x_coor, cell.y_coor + forward * 2);
            div.html = div.cell_render_available(div);
        }



        //move forward
        if (this.y_coor >= 1 && this.y_coor <= 8 && this.board.get_cell(this.x_coor, this.y_coor + forward).get_piece() == null) {
            movable_squares.push(this.board.get_cell(this.x_coor, this.y_coor + forward))
            let div = this.board.get_cell(this.x_coor, this.y_coor + forward);
            div.html = div.cell_render_available(div)
        }
        //two steps white
        if (this.y_coor == 2 && this.color == "white" && this.board.get_cell(this.x_coor, this.y_coor + forward * 2).get_piece() == null
            && this.board.get_cell(this.x_coor, this.y_coor + forward).get_piece() == null) {

            movable_squares.push(this.board.get_cell(this.x_coor, this.y_coor + forward * 2))

            // div rendered
            let div = this.board.get_cell(this.x_coor, this.y_coor + forward);
            div.html = div.cell_render_available(div);

            //another div rendered
            div = this.board.get_cell(this.x_coor, this.y_coor + forward * 2);
            div.html = div.cell_render_available(div);
        }

        //two steps black
        if (this.y_coor == 7 && this.color == "black" && this.board.get_cell(this.x_coor, this.y_coor + forward * 2).get_piece() == null
            && this.board.get_cell(this.x_coor, this.y_coor + forward).get_piece() == null) {

            movable_squares.push(this.board.get_cell(this.x_coor, this.y_coor + forward * 2))
            let div = this.board.get_cell(this.x_coor, this.y_coor + forward);
            div.html = div.cell_render_available(div);
            div = this.board.get_cell(this.x_coor, this.y_coor + forward * 2);
            div.html = div.cell_render_available(div);
        }

        //take out right
        if (this.y_coor >= 1 && this.y_coor <= 8 && this.board.get_cell(this.x_coor + forward, this.y_coor + forward) != undefined && this.board.get_cell(this.x_coor + forward, this.y_coor + forward).piece != null) {
            movable_squares.push(this.board.get_cell(this.x_coor + forward, this.y_coor + forward));
            let div = this.board.get_cell(this.x_coor + forward, this.y_coor + forward);
            div.html = div.cell_render_available(div);

        }

        //take out left
        if (this.y_coor >= 1 && this.y_coor <= 8 && this.board.get_cell(this.x_coor - forward, this.y_coor + forward) != undefined && this.board.get_cell(this.x_coor - forward, this.y_coor + forward).piece != null) {
            movable_squares.push(this.board.get_cell(this.x_coor - forward, this.y_coor + forward))

            let div = this.board.get_cell(this.x_coor - forward, this.y_coor + forward);
            div.html = div.cell_render_available(div);

        }




        return movable_squares;
    }




}

class Knight extends Piece {
    constructor(color, board, x_coor, y_coor) {
        super("knight_" + color, board, x_coor, y_coor);
        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_Knight.png"
        else
            this.img = "/minigames/chess/resources/img/Black_Knight.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }


    


    move_pattern(color) {
        let movable_squares = [];
        let forward = 0;
        let backward = 0;
        let bent = 1;
        let init_row = 0;
        let compare = null;

        if (this.color == "white") {
            forward = 1;
            backward = -1;
            init_row = 2;
        }
        else if (this.color == "black") {
            forward = -1;
            backward = 1;
            init_row = 8 - 2;
        }

        //move forward left
        if (this.y_coor >= 1 && this.y_coor <= 8 && this.board.get_cell(this.x_coor, this.y_coor + forward).get_piece() == null) {
            movable_squares.push(this.board.get_cell(this.x_coor, this.y_coor + forward))
            let div = this.board.get_cell(this.x_coor, this.y_coor + forward);
            div.html = div.cell_render_available(div)
        }

    }
}


class Bishop extends Piece {
    constructor(color, board, x_coor, y_coor) {
        super("bishop_" + color, board, x_coor, y_coor);
        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_Bishop.png"
        else
            this.img = "/minigames/chess/resources/img/Black_Bishop.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }
}

class Rook extends Piece {
    constructor(color, board, x_coor, y_coor) {
        super("rook_" + color, board, x_coor, y_coor);
        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_Rook.png"
        else
            this.img = "/minigames/chess/resources/img/Black_Rook.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }
}

class King extends Piece {
    constructor(color, board, x_coor, y_coor) {
        super("king_" + color, board, x_coor, y_coor);
        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_King.png"
        else
            this.img = "/minigames/chess/resources/img/Black_King.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }
}

class Queen extends Piece {
    constructor(color, board, x_coor, y_coor) {
        super("queen_" + color, board, x_coor, y_coor);
        this.board = board;
        this.color = color;
        this.x_coor = x_coor;
        this.y_coor = y_coor;

        //renders the chess according to the right color
        super.piece_render(color, x_coor, y_coor)
        if (this.color == "white")
            this.img = "/minigames/chess/resources/img/White_Queen.png"
        else
            this.img = "/minigames/chess/resources/img/Black_Queen.png"

        //this line of code 
        this.board.get_cell(x_coor, y_coor).set_piece(this);
        //invokes the render method from the super class 
        super.piece_render(color, x_coor, y_coor)

    }
}





function active_black() {
    pawn9.active = true;
    pawn10.active = true;
    pawn11.active = true;
    pawn12.active = true;
    pawn13.active = true;
    pawn14.active = true;
    pawn15.active = true;
    pawn16.active = true;

    night3.active = true;
    night4.active = true;

    bishop3.active = true;
    bishop4.active = true;

    


    pawn1.active = false;
    pawn2.active = false;
    pawn3.active = false;
    pawn4.active = false;
    pawn5.active = false;
    pawn6.active = false;
    pawn7.active = false;
    pawn8.active = false;

    night1.active = false
    night2.active = false

    bishop1.active = false;
    bishop2.active = false;

}

function active_white() {
     pawn9.active = false;
    pawn10.active = false;
    pawn11.active = false;
    pawn12.active = false;
    pawn13.active = false;
    pawn14.active = false;
    pawn15.active = false;
    pawn16.active = false;


    pawn1.active = true;
    pawn2.active = true;
    pawn3.active = true;
    pawn4.active = true;
    pawn5.active = true;
    pawn6.active = true;
    pawn7.active = true;
    pawn8.active = true;

    night1.active = true
    night2.active = true

    bishop1.active = true;
    bishop2.active = true;

}






//board creation
let board = new Board();
board.create_board();

//white pawns
let pawn1 = new Pawn("white", board, 1, 2);
let pawn2 = new Pawn("white", board, 2, 2);
let pawn3 = new Pawn("white", board, 3, 2);
let pawn4 = new Pawn("white", board, 4, 2);
let pawn5 = new Pawn("white", board, 5, 2);
let pawn6 = new Pawn("white", board, 6, 2);
let pawn7 = new Pawn("white", board, 7, 2);
let pawn8 = new Pawn("white", board, 8, 2);

//white_knight
let night1 = new Knight("white",board,2,1)
let night2 = new Knight("white",board,7,1)

//white_bishop
let bishop1 = new Bishop("white",board,3,1)
let bishop2 = new Bishop("white",board,6,1)

//white_rook
let rook1 = new Rook("white",board,1,1)
let rook2 = new Rook("white",board,8,1)

//white_king
let king1 = new King("white",board,5,1)

//white_queen
let queen1 = new Queen("white",board,4,1)





//black pawns
let pawn9 = new Pawn( "black", board, 1, 7);
let pawn10 = new Pawn("black", board, 2, 7);
let pawn11 = new Pawn("black", board, 3, 7);
let pawn12 = new Pawn("black", board, 4, 7);
let pawn13 = new Pawn("black", board, 5, 7);
let pawn14 = new Pawn("black", board, 6, 7);
let pawn15 = new Pawn("black", board, 7, 7);
let pawn16 = new Pawn("black", board, 8, 7);

//black_knight
let night3 = new Knight("black",board,2,8)
let night4 = new Knight("black",board,7,8)


//black_bishop
let bishop3 = new Bishop("black",board,3,8)
let bishop4 = new Bishop("black",board,6,8)

//black_rook
let rook3 = new Rook("black",board,1,8)
let rook4 = new Rook("black",board,8,8)

//black_king
let king2 = new King("black",board,5,8)

//black_queen
let queen2 = new Queen("black",board,4,8)


class Event_Listener {
    constructor(cell) {
        this.cell = cell;
        this.available;
    }
    static click() {
        let div = this.cell.html;
        $(div).on("click", () => {
            $(div).css("background-color", "green")
            console.log(cell.get_x_coor() + " " + cell.get_y_coor());
            if (this.cell.get_piece() != null) {
                this.cell.get_piece().move_pattern();
            }
        })
    }
}