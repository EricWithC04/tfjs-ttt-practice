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
            alert(`Jugador con ${currentPlayer === -1 ? 'X' : 'O'} ha ganado!`);
            gameActive = false;
            return;
        }

        if (boardState.every(cell => cell !== 0)) {
            alert('Es un empate!');
            gameActive = false;
            return;
        }

        currentPlayer = 1;

        result = await predictPosition(boardState)
        predictedPosition = result.dataSync()
        // console.log(predictedPosition);
        setTimeout(() => {
            const position = maxValueWithCondition(predictedPosition, boardState)
            boardState[position] = currentPlayer;
            cells[position].textContent = currentPlayer === -1 ? 'X' : 'O';
            currentPlayer = -1
        }, 2000)
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

function maxValueWithCondition(array1, array2) {
    if (array1.length !== 9 || array2.length !== 9) {
        throw new Error("Ambos arrays deben tener 9 posiciones.");
    }

    // Crear una copia del primer array y ordenarlo en orden descendente
    let sortedArray = [...array1].sort((a, b) => b - a);

    // Recorrer el array ordenado y buscar el valor cuya posición correspondiente en array2 sea 0
    for (let value of sortedArray) {
        let i = array1.indexOf(value);
        if (array2[i] === 0) {
            return i;
        }
    }
}