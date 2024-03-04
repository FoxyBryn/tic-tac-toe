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

const gameController = (function(
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

    const resetGame = () => {
        board.resetBoard();
        activePlayer = players[0];
        console.log("Game reset.");
        printNewRound();

        for (const player of players) {
            player.choices = [];
        }
    };

    printNewRound();

    return { playRound, resetGame, getActivePlayer };
})();