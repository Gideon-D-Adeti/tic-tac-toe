const start = document.querySelector(".start");
const playersInfoDialog = document.querySelector(".players-info-dialog");
const cancelButton = document.querySelector(".cancel-button");
const playersInfoForm = document.querySelector(".players-info-form");
const gameContainer = document.querySelector(".game-container");
const gameOutcomeDialog = document.querySelector(".game-outcome-dialog");
const nextGameButton = gameOutcomeDialog.querySelector(".next-game");
const newGameButton = document.querySelector(".new-game");

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
  let tieScore = 0;
  let player1;
  let player2;
  let currentPlayer;

  const increaseTieScore = () => tieScore++;
  const resetTieScore = () => (tieScore = 0);

  const startNewGame = (p1, p2) => {
    player1 = p1;
    player2 = p2;
    currentPlayer = player1; // Start with player1

    // Clear previous board state and event listeners
    Gameboard.resetBoard();
    clearCells();
    clearCellEventListeners();

    updatePlayers(
      player1.getName(),
      player1.getSymbol(),
      player2.getName(),
      player2.getSymbol()
    );
    updateScores(player1.getScore(), player2.getScore(), tieScore);

    // Add event listeners to cells
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });

    updateTurn(currentPlayer.getName());
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkForWinner = () => {
    const board = Gameboard.getBoard();

    // Define winning combinations
    const winningCombinations = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];

    // Check each winning combination
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
        return true;
      }
    }

    // If no winner is found
    return false;
  };

  const checkForDraw = () => {
    const board = Gameboard.getBoard();

    if (board.every((cell) => cell !== "")) {
      return true;
    }

    return false;
  };

  const handleCellClick = (event) => {
    const cellId = event.target.id;
    const isSpaceOccupied = !Gameboard.updateBoard(cellId, currentPlayer);

    if (!isSpaceOccupied) {
      updateCell(cellId, currentPlayer.getSymbol());
      if (checkForWinner()) {
        currentPlayer.increaseScore();
        displayGameOutCome(currentPlayer.getName());
      } else if (checkForDraw()) {
        increaseTieScore();
        displayGameOutCome("tie");
      }
      switchTurn();
      updateTurn(currentPlayer.getName());
    } else {
      updateTurn(currentPlayer.getName(), true);
    }
  };

  const clearCellEventListeners = () => {
    document.querySelectorAll(".cell").forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
    });
  };

  const startNextGame = () => {
    gameOutcomeDialog.close();
    startNewGame(player1, player2);
  };

  const startNewRound = () => {
    gameOutcomeDialog.close();
    resetTieScore();
    playersInfoDialog.showModal();
  };

  return {
    startNewGame,
    startNextGame,
    startNewRound,
    switchTurn,
    checkForWinner,
  };
})();

const Player = (name, symbol) => {
  let score = 0;
  const getName = () => name;
  const getScore = () => score;
  const increaseScore = () => score++;
  const getSymbol = () => symbol;
  const makeMove = function (index) {
    return Gameboard.updateBoard(index, this);
  };

  return {
    increaseScore,
    getScore,
    getName,
    getSymbol,
    makeMove,
  };
};

function getInputValues() {
  const player1Name = playersInfoForm.querySelector("#player1-name").value;
  const player1Symbol = "X";
  const player2Name = playersInfoForm.querySelector("#player2-name").value;
  const player2Symbol = "O"

  return {
    player1Name,
    player1Symbol,
    player2Name,
    player2Symbol,
  };
}

function updatePlayers(player1Name, player1Symbol, player2Name, player2Symbol) {
  const player1NameHeader = gameContainer.querySelector(".player1-name");
  const player2NameHeader = gameContainer.querySelector(".player2-name");
  const vs = gameContainer.querySelector(".vs");

  player1NameHeader.textContent = `${player1Name} (${player1Symbol})`;
  player2NameHeader.textContent = `${player2Name} (${player2Symbol})`;
  vs.textContent = "Vs.";
}

function updateScores(player1Score, player2Score, tieScore) {
  const player1ScoreSpan = gameContainer.querySelector(".player1-score");
  const player2ScoreSpan = gameContainer.querySelector(".player2-score");
  const tieScoreSpan = gameContainer.querySelector(".tie-score");

  player1ScoreSpan.textContent = player1Score;
  player2ScoreSpan.textContent = player2Score;
  tieScoreSpan.textContent = tieScore;
}

function updateTurn(turn, alert = false) {
  const turnSpan = gameContainer.querySelector(".turn");

  if (!alert) {
    turnSpan.textContent = `${turn}'s turn`;
  } else {
    turnSpan.textContent = `Yo, ${turn}, that space is already occupied!`;
  }
}

function createPlayers(player1Name, player1Symbol, player2Name, player2Symbol) {
  const player1 = Player(player1Name, player1Symbol);
  const player2 = Player(player2Name, player2Symbol);

  return { player1, player2 };
}

function updateCell(cellId, playerSymbol) {
  const cell = document.getElementById(cellId);

  cell.textContent = playerSymbol;
}

function clearCells() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
  });
}

function clearInputValues() {
  playersInfoForm.querySelector("#player1-name").value = "";
  playersInfoForm.querySelector("#player2-name").value = "";
}

function displayGameOutCome(outcome) {
  const outcomeHeader = gameOutcomeDialog.querySelector(".outcome");
  if (outcome === "tie") {
    outcomeHeader.textContent = "It's a tie!";
  } else {
    outcomeHeader.textContent = `${outcome} wins!`;
  }
  gameOutcomeDialog.showModal();
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
  clearInputValues();
  playersInfoDialog.close();
});

nextGameButton.addEventListener("click", GameController.startNextGame);

newGameButton.addEventListener("click", GameController.startNewRound);
