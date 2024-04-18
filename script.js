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

const GameController = (() => {
  let drawScore = 0;
  let player1;
  let player2;
  let currentPlayer;

  const startNewGame = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    currentPlayer = player1; // Start with player1
    updateStatus(
      player1.getName(),
      player1.getSymbol(),
      player2.getName(),
      player2.getSymbol(),
      player1.getScore(),
      player2.getScore(),
      drawScore,
      currentPlayer.getName()
    );

    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        currentPlayer.makeMove(cell.id);
        console.log(Gameboard.getBoard());
        switchTurn();
      })
    })
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkForWinner = () => {
    const board = Gameboard.getBoard();
    // Logic to check for a winner
  };

  return {
    startNewGame,
    switchTurn,
    checkForWinner,
  };
})();

const Player = (name, symbol) => {
  let score = 0;
  const getName = () => name;
  const getScore = () => score;
  const getSymbol = () => symbol;
  const makeMove = function (index) {
    return Gameboard.updateBoard(index, this);
  };

  return {
    getScore,
    getName,
    getSymbol,
    makeMove,
  };
};

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

function updateStatus(
  player1Name,
  player1Symbol,
  player2Name,
  player2Symbol,
  player1Score,
  player2Score,
  drawScore,
  turn
) {
  const player1NameHeader = gameContainer.querySelector(".player1-name");
  const player1ScoreSpan = gameContainer.querySelector(".player1-score");

  const player2NameHeader = gameContainer.querySelector(".player2-name");
  const player2ScoreSpan = gameContainer.querySelector(".player2-score");

  const vs = gameContainer.querySelector(".vs");
  const drawScoreSpan = gameContainer.querySelector(".draw-score");
  const turnSpan = gameContainer.querySelector(".turn");

  player1NameHeader.textContent = `${player1Name} (${player1Symbol})`;
  player1ScoreSpan.textContent = player1Score;

  player2NameHeader.textContent = `${player2Name} (${player2Symbol})`;
  player2ScoreSpan.textContent = player2Score;

  vs.textContent = "Vs.";
  drawScoreSpan.textContent = drawScore;
  turnSpan.textContent = `${turn}'s turn`
}

function createPlayers(player1Name, player1Symbol, player2Name, player2Symbol) {
  const player1 = Player(player1Name, player1Symbol);
  const player2 = Player(player2Name, player2Symbol);

  return { player1, player2 };
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

  const { player1, player2 } = createPlayers(
    player1Name,
    player1Symbol,
    player2Name,
    player2Symbol
  );

  GameController.startNewGame(player1, player2);

  playersInfoDialog.close();
});
