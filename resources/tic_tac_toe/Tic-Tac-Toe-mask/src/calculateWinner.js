/**
 * Returns the winner of the match based on the specified 4x4 tic tac toe board.
 * If there's no winner, i.e. the match hasn't finished or draw, returns "TIE".
 */
export function calculateWinner(squares) {

  //Default
  let winner = "TIE";
  // Check for vertical
  for (let column = 0; column < 4; column++) {
    if (squares[0][column] === squares[1][column] &&
      squares[1][column] === squares[2][column] && squares[2][column] === squares[3][column]

      &&
      squares[0][column]

    ) {
      winner = squares[0][column];
    }
  }

  // Check for horizontal
  for (let row = 0; row < 4; row++) {
    if (squares[row][0] === squares[row][1] &&
      squares[row][1] === squares[row][2] &&
      squares[row][2] === squares[row][3]

      &&
      squares[row][0]) {
      winner = squares[row][0];
    }
  }

  // Check \ diagonal
  if (squares[0][0] && squares[0][0] === squares[1][1] &&
    squares[1][1] === squares[2][2] &&
    squares[2][2] === squares[3][3]

  ) {
    winner = squares[0][0];
  }

  // Check / diagonal
  if (squares[0][3] && squares[0][3] === squares[1][2] &&
    squares[1][2] === squares[2][1] && squares[2][1] === squares[3][0]
  ) {
    winner = squares[0][3];
  }

  return winner;
}