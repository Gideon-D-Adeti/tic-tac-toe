const start = document.querySelector(".start");
const playersInfoDialog = document.querySelector(".players-info-dialog");
const cancelButton = document.querySelector(".cancel-button");
const playersInfoForm = document.querySelector(".players-info-form");
const gameContainer = document.querySelector(".game-container");

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

function getInputValues() {
  const player1Name = playersInfoForm.querySelector("#player1-name").value;
  const player1Symbol = playersInfoForm.querySelector(
    'input[name="player1-symbol"]:checked'
  ).value;
  const player2Name = playersInfoForm.querySelector("#player2-name").value;
  const player2Symbol = player1Symbol === "X" ? "O" : "X"; // Automatically assign symbol for Player 2

  return {
    player1Name,
    player1Symbol,
    player2Name,
    player2Symbol,
  };
}

function updateStatus(player1Name, player1Symbol, player2Name, player2Symbol) {
  const player1NameHeader = gameContainer.querySelector(".player1-name");
  const player2NameHeader = gameContainer.querySelector(".player2-name");
  const vs = gameContainer.querySelector(".vs");

  player1NameHeader.textContent = `${player1Name} (${player1Symbol})`;
  player2NameHeader.textContent = `${player2Name} (${player2Symbol})`;

  vs.textContent = "Vs.";
}

start.addEventListener("click", () => {
  playersInfoDialog.showModal();
});

cancelButton.addEventListener("click", () => {
  playersInfoDialog.close();
});

playersInfoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const { player1Name, player1Symbol, player2Name, player2Symbol } =
    getInputValues();

  updateStatus(player1Name, player1Symbol, player2Name, player2Symbol);

  playersInfoDialog.close();
});
