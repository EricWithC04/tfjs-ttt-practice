document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill(null);

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (boardState[index] !== null || !gameActive) {
            return;
        }

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer;

        if (checkWinner()) {
            alert(`${currentPlayer} ha ganado!`);
            gameActive = false;
            return;
        }

        if (boardState.every(cell => cell !== null)) {
            alert('Es un empate!');
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWinner() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return boardState[index] === currentPlayer;
            });
        });
    }

    function resetGame() {
        boardState.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});
