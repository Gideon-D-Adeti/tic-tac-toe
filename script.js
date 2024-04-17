const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;
  const updateBoard = (index, player) => {
    if (board[index] === "") {
      board[index] = player.getSymbol();
      return true; // Successfully updated the board
    }
    return false; // Space already occupied
  };
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    updateBoard,
    resetBoard,
  };
})();

const Player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  const makeMove = function (index) {
    return Gameboard.updateBoard(index, this);
  };

  return {
    getName,
    getSymbol,
    makeMove,
  };
};

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

const GameController = (() => {
  let currentPlayer = player1;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkForWinner = () => {
    const board = Gameboard.getBoard();
    // Logic to check for a winner
  };

  const startNewGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
  };

  return {
    switchTurn,
    checkForWinner,
    startNewGame,
  };
})();