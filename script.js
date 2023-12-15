var originalBoard;
let currentPlayer;
let gameMode = "twoPlayer";
const Player1 = 'X';
const Player2 = 'O';
const aiPlayer = 'O';

const combosOfWin = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cells = document.querySelectorAll('.box');
const modeButton = document.querySelector('#modeButton');
const currentPlayerDisplay = document.getElementById('currentPlayer');

start();

function start() {
    document.querySelector(".gameresult").style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    currentPlayer = Player1;
    updateCurrentPlayerDisplay();
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
    modeButton.removeEventListener('click', switchMode);
    modeButton.addEventListener('click', switchMode);
    modeButton.innerText = (gameMode === "twoPlayer") ? "Switch to AI Mode" : "Switch to Two-Player Mode";
}


function switchMode() {
    gameMode = (gameMode === "twoPlayer") ? "ai" : "twoPlayer";
    start();
    modeButton.innerText = (gameMode === "twoPlayer") ? "Switch to AI Mode" : "Switch to Two-Player Mode";
}

function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.innerText = `Current Turn: ${currentPlayer === Player1 ? 'Player 1 (X)' : 'Player 2 (O)'}`;
    currentPlayerDisplay.style.backgroundColor = (currentPlayer === Player1) ? "#f0aefb" : "#aecffb";
}

function turnClick(square) {
    if (typeof originalBoard[square.target.id] == 'number') {
        if (gameMode === "twoPlayer") {
            turn(square.target.id, currentPlayer);
            if (!checkTie()) {
                currentPlayer = (currentPlayer === Player1) ? Player2 : Player1;
                updateCurrentPlayerDisplay();
            }
        } else {
            turn(square.target.id, Player1);
            updateCurrentPlayerDisplay();
            if (!checkTie()) {
                turn(aiTurn(), aiPlayer);
            }
        }
    }
}

function turn(squareID, player) {
    originalBoard[squareID] = player;
    document.getElementById(squareID).innerText = player;
    let gameWin = checkWin(originalBoard, player);
    if (gameWin) gameOver(gameWin)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWin = null;
    for (let [index, win] of combosOfWin.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWin = { index: index, player: player };
            break;
        }
    }
    return gameWin;
}

function gameOver(gameWin) {
    for (let index of combosOfWin[gameWin.index]) {
        document.getElementById(index).style.backgroundColor = gameWin.player == Player1 ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner((gameMode === "twoPlayer" && gameWin.player == Player1) ? "Player 1 (X) WON!" : 
                  (gameMode === "twoPlayer" && gameWin.player == Player2) ? "Player 2 (O) WON!" :
                  (gameMode === "ai" && gameWin.player == Player1) ? "You WON!" :
                  (gameMode === "ai" && gameWin.player == aiPlayer) ? "AI WON!" : "It's a Tie!");
}

function declareWinner(who) {
    document.querySelector(".gameresult").style.display = "block";
    document.querySelector(".gameresult").innerText = who;
}

function emptySquare() {
    return originalBoard.filter(s => typeof s == 'number');
}

function aiTurn() {
    return minimax(originalBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquare().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "blue";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("It's a Tie!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var khalispot = emptySquare(newBoard);

    if (checkWin(newBoard, Player1)) {
        return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
    } else if (khalispot.length === 0) {
        return { score: 0 };
    }

    var moves = [];

    for (var i = 0; i < khalispot.length; i++) {
        var move = {};
        move.index = khalispot[i];
        newBoard[khalispot[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, Player1);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[khalispot[i]] = move.index;
        moves.push(move);
    }

    var bestMove;
    if (player == aiPlayer) {
        var bestScore = -Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = Infinity;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
