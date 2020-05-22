//All imports
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { calculateWinner } from './calculateWinner.js';
import { isFull } from './isFull.js';
import { nextMove } from "./nextMove.js";
import { human } from "./human.js";
import { computer } from "./computer.js";

//squares
function Square(props) {
  const squareClass = "square " + (props.value ? "" : "hoverable ")
    + (props.value === human ? human : computer);

  return (
    <button className={squareClass} onClick={props.onClick}>
      <span>{props.value}</span>
    </button>
  );
}

//The board
class Board extends React.Component {
  renderSquare(row, column) {
    return <Square
      value={this.props.squares[row][column]}
      onClick={() => this.props.onClick(row, column)}
    />;
  }

  createBoard() {
    let board = [];

    for (let row = 0; row < 4; row++) {
      let boardRow = [];

      for (let column = 0; column < 4; column++) {
        boardRow.push(this.renderSquare(row, column));
      }

      board.push(<div className="board-row">{boardRow}</div>);
    }

    return board;
  }
//what shows up
  render() {
    return (
      <>{this.createBoard()}</>
    );
  }
}

//The game
class Game extends React.Component {

    //"constructor"
  constructor(props) {
    super(props);
    this.state = {
      squares: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
      ],
      humanFirst: true,
      gameStart: true,
      
    }
  }

  handleClick(row, column) {
    const squares = this.state.squares.slice();

    if (squares[row][column]) {
      return;
    }

      //if they are either full or someone wins
    if (calculateWinner(squares) !== "TIE" || isFull(squares)) {
      return (
        <button onClick={() => this.clearBoard()}>
          REPLAY
        </button>
      );
    }

    squares[row][column] = human;

    this.setState({
      squares: squares,
      gameStart: false,
    });

    nextMove(squares);
  }

  //clear the board
  clearBoard() {
    this.setState({
      squares: [
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""],
        ["", "", "", ""]
      ],
      humanFirst: !this.state.humanFirst,
      gameStart: true,
    });
  }

//what actually shows up
  render() {
    const squares = this.state.squares;
    let playBtn;
    let point_status = "You haven't gained points for this round.";  
    let status = "Tic-Tac-Toe Mask Version";
    
    const winner = calculateWinner(squares);

    if (this.state.gameStart && !this.state.humanFirst) {
      nextMove(squares);
      this.setState({
        squares: squares,
        gameStart: false,
      });
    }

      //either someone wins or the board is full
    if (winner !== "TIE" || isFull(squares)) {
      status = "Winner: " + winner;
      playBtn = <button onClick={() => this.clearBoard()}
                  className="replay">
                    REPLAY
                  </button>
      
      point_status = <p>You just gained 5 points.</p>
    }

    return (
        
      <div className="game">
        <div className="points"> {point_status}</div>
        <div className="status">{status}</div>
        <div className="game-board">
          <Board
            squares={squares}
            onClick={(row, column) => this.handleClick(row, column)}
          />
           
        </div>
        <>{playBtn}</>
      </div>
    );
  }
}

//Footer
class Footer extends React.Component {

  render() {

    return (
      <div className="footer">
        <p>
          Made by FutureCurves.
        </p>
      </div>
    );
  }
}

//Header
class Header extends React.Component {

  render() {

    return (
      <div className="container">
        
<a href="https://futurecurves.ca/games/ttt" className="square_btn_second">Go back to character selection</a>
<br></br>
<br></br>

<a href="https://futurecurves.ca/minigames" className="square_btn_second">Go back to Mini Games</a>
    </div>
    );
  }
}



// ========================================

ReactDOM.render(
  <>
    <Header />
    <Game />
    <Footer />
  </>,
  document.getElementById('root')
);