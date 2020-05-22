import { calculateWinner } from "./calculateWinner";
import { isFull } from "./isFull";

import { human } from "./human.js";
import { computer } from "./computer.js";

/**
 * Randomly moving by checking every move and the available squares.
 */
export function nextMove(board) {
//    if it is full
  if (isFull(board)) {
    return;
  }

  
  let bestMoveRow = -1;
  let bestMoveColumn = -1;
  
  let temp_row = [];
    let temp_col = [];
    
    let selected_row;
    let selected_col;
    
    
    let moved = false;
    
    //checking all available squares
    for (let row = 0; row < 4; row++) {

        for (let column = 0; column < 4; column++) {

            if (!board[row][column]) {
          
                temp_row.push(row);
                temp_col.push(column);

            } 
        }
    }
    
    //Choose one available square for the computer
    while(!moved){
        selected_row = Math.floor(Math.random() * temp_row.length);
        selected_col = Math.floor(Math.random() * temp_col.length);

        if (!board[temp_row[selected_row]][temp_col[selected_col]]){
            bestMoveRow = temp_row[selected_row];
            bestMoveColumn = temp_col[selected_col];
            moved = true;
        }
    }

    board[bestMoveRow][bestMoveColumn] = computer;
    
}