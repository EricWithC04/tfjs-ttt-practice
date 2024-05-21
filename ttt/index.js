document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('reset');
    let currentPlayer = -1;
    let gameActive = true;
    let boardState = Array(9).fill(0);

    let predictedPosition = null

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

    async function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (boardState[index] !== 0 || !gameActive) {
            return;
        }

        boardState[index] = currentPlayer;
        cell.textContent = currentPlayer === -1 ? 'X' : 'O';

        if (checkWinner()) {
            alert(`${currentPlayer} ha ganado!`);
            gameActive = false;
            return;
        }

        if (boardState.every(cell => cell !== 0)) {
            alert('Es un empate!');
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === -1 ? 1 : -1;

        result = await predictPosition(boardState)
        predictedPosition = result.dataSync()
        // console.log(predictedPosition);
    }

    function checkWinner() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return boardState[index] === currentPlayer;
            });
        });
    }

    function resetGame() {
        boardState.fill(0);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = -1;
        gameActive = true;
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', resetGame);
});

function predictPosition(tableGame) {
    return new Promise ((resolve, _reject) => {
        tf.ready().then(() => {
            const modelPath = '../model/ttt_model.json'
            tf.tidy(() => {
                tf.loadLayersModel(modelPath).then((model) => {
                    // Board states
                    const goForTheKill = tf.tensor(tableGame)
        
                    // Stack states into a shape [3, 9]
                    const match = tf.stack([goForTheKill])
                    const result = model.predict(match)
                    // Log the results
                    // result.reshape([9]).print()

                    resolve(result)
                })
            })
        })
    })
}