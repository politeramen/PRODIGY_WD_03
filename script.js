const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
const winningMessageElement = document.getElementById('winningMessage');
const turnIndicator = document.getElementById('turnIndicator');
const gameModeSelect = document.getElementById('gameMode');
const X_CLASS = 'x';
const O_CLASS = 'o';
let oTurn;
let aiOpponent = false;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);
gameModeSelect.addEventListener('change', changeGameMode);

function startGame() {
    oTurn = false;
    aiOpponent = gameModeSelect.value === 'ai';
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerText = ''; 
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    updateTurnIndicator();
    winningMessageElement.classList.add('hidden');
    winningMessageElement.innerText = '';
    if (aiOpponent && !oTurn) {
        setTimeout(makeAIMove, 1000); 
    }
}

function changeGameMode() {
    startGame();
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = oTurn ? O_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false, currentClass);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        updateTurnIndicator();
        if (aiOpponent && !oTurn) {
            setTimeout(makeAIMove, 1000);
        }
    }
}

function makeAIMove() {
    const availableCells = [...cellElements].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
    if (availableCells.length > 0) {
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        placeMark(randomCell, X_CLASS);
        if (checkWin(X_CLASS)) {
            endGame(false, X_CLASS);
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            setBoardHoverClass();
            updateTurnIndicator();
        }
    }
}

function endGame(draw, winningClass) {
    if (draw) {
        winningMessageElement.innerText = 'Draw!';
        winningMessageElement.style.color = '#d1d1d1';
    } else {
        winningMessageElement.innerText = `${winningClass === X_CLASS ? "X's" : "O's"} Wins!`;
    }
    winningMessageElement.classList.remove('hidden');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerText = currentClass === X_CLASS ? 'X' : 'O'; 
}

function swapTurns() {
    oTurn = !oTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(O_CLASS);
    if (oTurn) {
        board.classList.add(O_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function updateTurnIndicator() {
    turnIndicator.innerText = `It's ${oTurn ? "O's" : "X's"} turn`;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
