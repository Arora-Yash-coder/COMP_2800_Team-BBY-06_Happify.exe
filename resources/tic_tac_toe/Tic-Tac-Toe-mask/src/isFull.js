/**
 * Returns if the specified 4x4 tic tac toe board is full or not.
 */
export function isFull(squares) {
  return squares[0][0] && squares[0][1] && squares[0][2] && squares[0][3] &&
    squares[1][0] && squares[1][1] && squares[1][2] && squares[1][3] &&
    squares[2][0] && squares[2][1] && squares[2][2] && squares[2][3] &&
    squares[3][0] && squares[3][1] && squares[3][2] && squares[3][3];
}