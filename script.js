const size = 10;
const numMines = 10;
let board = [];
let revealed = [];
let mines = new Set();
let totalPoints = 0;

function initBoard() {
    board = Array.from({ length: size }, () => Array(size).fill(' '));
    revealed = Array.from({ length: size }, () => Array(size).fill(false));
    mines = new Set();
    totalPoints = 0;
    placeMines();
    calculateAdjacentNumbers();
}

function placeMines() {
    while (mines.size < numMines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (!mines.has(`${row},${col}`)) {
            mines.add(`${row},${col}`);
            board[row][col] = 'M';
        }
    }
}

function calculateAdjacentNumbers() {
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 'M') continue;
            let count = 0;
            for (let r = Math.max(0, row - 1); r <= Math.min(size - 1, row + 1); r++) {
                for (let c = Math.max(0, col - 1); c <= Math.min(size - 1, col + 1); c++) {
                    if (board[r][c] === 'M') count++;
                }
            }
            if (count > 0) board[row][col] = count.toString();
        }
    }
}

function revealCell(row, col) {
    if (revealed[row][col]) return;
    revealed[row][col] = true;
    if (board[row][col] !== ' ' && board[row][col] !== 'M') {
        totalPoints += parseInt(board[row][col]);
    }
    updateBoard();
}

function updateBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (revealed[row][col]) {
                cell.classList.add('revealed');
                cell.textContent = board[row][col];
            }
            if (board[row][col] === 'M') {
                cell.classList.add('mine');
            }
            cell.addEventListener('click', () => handleClick(row, col));
            gameBoard.appendChild(cell);
        }
    }
    document.getElementById('win-count').textContent = `Total Points: ${totalPoints}`;
}

function handleClick(row, col) {
    if (board[row][col] === 'M') {
        document.getElementById('status').textContent = `Game Over! You hit a mine and won $${totalPoints * 10}.`;
        revealAllMines();
    } else {
        revealCell(row, col);
        checkWin();
    }
}

function revealAllMines() {
    for (let mine of mines) {
        const [row, col] = mine.split(',').map(Number);
        revealed[row][col] = true;
    }
    updateBoard();
}

function checkWin() {
    let allRevealed = true;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!revealed[row][col] && board[row][col] !== 'M') {
                allRevealed = false;
                break;
            }
        }
    }
    if (allRevealed) {
        document.getElementById('status').textContent = 'Congratulations! You won!';
    }
}

function startGame() {
    initBoard();
    updateBoard();
    document.getElementById('status').textContent = '';
}

document.addEventListener('DOMContentLoaded', startGame);

document.getElementById('reset-button').addEventListener('click', startGame);
