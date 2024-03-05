function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(cell());
        }
    }

    const getBoard = () => board;

    const markBoard = ([row, column], player) => {
        if (board[row][column].getMark() === '') {
            board[row][column].setMark(player);
            return board[row][column].getMark();
        } else {
            console.log('Error: This cell has already been marked.');
            return;
        }
    };

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].setMark('');
            }
        }
    };

    const printBoard = () => {
        for (let i = 0; i < rows; i++) {
            let rowString = '';
            for (let j = 0; j < columns; j++) {
                const mark = board[i][j].getMark() || ' ';
                rowString += mark + (j < columns - 1 ? ' | ' : '');
            }
            console.log(rowString);
            if (i < rows - 1) {
                console.log('-'.repeat(columns * 4 - 1));
            }
        }
    };

    return { getBoard, markBoard, resetBoard, printBoard };
}

function cell() {
    let mark = '';

    const setMark = (playerMark) => {
        mark = playerMark;
    };

    const getMark = () => mark;

    return { setMark, getMark };
}

function gameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = gameBoard();

    const players = [
        {
            name: playerOneName,
            mark: 'x',
            choices: []
        },
        {
            name: playerTwoName,
            mark: 'o',
            choices: []
        }
    ];

    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(
            `Marking ${getActivePlayer().name}'s mark into cell [${row}, ${column}] ...`
        );
        
        const markResult = board.markBoard([row, column], getActivePlayer().mark);

        if (markResult === undefined) {
            return;
        }

        getActivePlayer().choices.push(row * 3 + column);
        if (checkWin(getActivePlayer())) {
            console.log(`${getActivePlayer().name} wins!`);
            board.printBoard();
            handleWin(getActivePlayer().name);
            return;
        }

        if (checkDraw()) {
            console.log("It's a draw!");
            board.printBoard();
            handleDraw();
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    const checkWin = (player) => {
        const playerChoices = player.choices;
    
        for (const combination of winningCombinations) {
            if (combination.every(cellIndex => playerChoices.includes(cellIndex))) {
                return true;
            }
        }
        return false;
    };

    const checkDraw = () => {
        const flattenedChoices = players.map(player => player.choices).flat();
        return flattenedChoices.length === board.getBoard().flat().length;
    };

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
        console.log("Game reset.");
        printNewRound();

        for (const player of players) {
            player.choices = [];
        }
    };

    let gameState = {
        status: '',
        winner: null,
        disableCells: false,
        disableTurn: false
    };

    const setGameState = (state) => {
        gameState = state;
    };

    const getGameState = () => {
        return gameState;
    };

    const handleWin = (winnerName) => {
        setGameState({
            status: `${winnerName} wins!`,
            winner: winnerName,
            disableCells: true,
            disableTurn: true
        });
    };

    const handleDraw = () => {
        setGameState({
            status: `It's a draw!`,
            winner: null,
            disableCells: true,
            disableTurn: true
        });
    };

    printNewRound();

    return { playRound, resetGame, getActivePlayer, getBoard: board.getBoard, getGameState };
}

const screenController = (function () {
    const game = gameController();
    const playerTurnDiv = document.querySelector('.player-turn');
    const boardDiv = document.querySelector('.board');
    const gameStateDiv = document.querySelector('.game-state');

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement('button');
                cellButton.classList.add('cell');
                cellButton.textContent = cell.getMark();
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;
                boardDiv.appendChild(cellButton);
            });
        });

        const gameState = game.getGameState();
        gameStateDiv.textContent = gameState.status;

        if (gameState.disableCells) {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.disabled = true;
            });
        }

        if (gameState.disableTurn) {
            playerTurnDiv.style.display = 'none';
        }
    };

    function clickHandlerBoard(event) {
        const selectedCell = event.target;
        if (!selectedCell) return;

        const rowIndex = parseInt(selectedCell.dataset.row);
        const columnIndex = parseInt(selectedCell.dataset.column);

        game.playRound(rowIndex, columnIndex);
        updateScreen();
    }
    boardDiv.addEventListener('click', clickHandlerBoard);

    updateScreen();
})();