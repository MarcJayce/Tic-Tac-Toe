const Gameboard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        }
    };

    const placeMarker = (index, marker) => {
        if (board[index] === '') {
            board[index] = marker;
            return true;
        }
        return false;
    };

    return { getBoard, resetBoard, placeMarker };
})();

const Player = (name, marker) => {
    return { name, marker };
};

let player1, player2, mode, currentPlayer;

const GameController = (() => {
    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
        document.getElementById('currentPlayer').innerText = `Current Player: ${currentPlayer.name} (${currentPlayer.marker})`;
        if (mode === 'pc' && currentPlayer === player2) {
            playPcTurn();
        }
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
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

        for (let combination of WINNING_COMBINATIONS) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const playRound = (index) => {
        if (Gameboard.placeMarker(index, currentPlayer.marker)) {
            renderBoard();
            const winner = checkWinner();
            if (winner) {
                displayWinningMessage(`${currentPlayer.name} (${winner}) wins!`);
            } else if (isDraw()) {
                displayWinningMessage('Draw!');
            } else {
                switchPlayer();
            }
        }
    };

    const isDraw = () => Gameboard.getBoard().every(cell => cell !== '');

    const displayWinningMessage = (message) => {
        const winningMessageElement = document.getElementById('winningMessage');
        const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
        winningMessageTextElement.innerText = message;
        winningMessageElement.classList.add('show');
    };

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cellElements.forEach((cell, index) => {
            cell.innerText = board[index];
        });
    };

    const playPcTurn = () => {
        const emptyCells = Gameboard.getBoard().map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        playRound(randomIndex);
    };

    return { playRound, switchPlayer };
})();

const cellElements = document.querySelectorAll('[data-cell]');

cellElements.forEach(cell => {
    cell.addEventListener('click', (e) => {
        const index = Array.from(cellElements).indexOf(e.target);
        GameController.playRound(index);
    });
});

document.getElementById('startButton').addEventListener('click', () => {
    const player1Name = document.getElementById('player1Name').value || 'Player 1';
    const player2Name = document.getElementById('player2Name').value || 'Player 2';
    mode = document.querySelector('input[name="opponent"]:checked').value;
    player1 = Player(player1Name, 'X');
    player2 = mode === 'pc' ? Player('PC', 'O') : Player(player2Name, 'O');
    currentPlayer = player1;
    document.getElementById('currentPlayer').innerText = `Current Player: ${currentPlayer.name} (${currentPlayer.marker})`;
    document.querySelector('.setup').style.display = 'none';
    document.getElementById('board').style.display = 'grid';
});

document.getElementById('restartButton').addEventListener('click', () => {
    Gameboard.resetBoard();
    document.getElementById('winningMessage').classList.remove('show');
    document.querySelector('.setup').style.display = 'block';
    document.getElementById('board').style.display = 'none';
    renderBoard();
});

function renderBoard() {
    const board = Gameboard.getBoard();
    cellElements.forEach((cell, index) => {
        cell.innerText = board[index];
    });
}
