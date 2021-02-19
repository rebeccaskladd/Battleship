const start = () => {
    spaces.forEach(space => {
        gameBoard[space.id] = 'not guessed';
    });

    renderBoard();
}

const renderBoard = () => {
    for (space in gameBoard) {
        const span = document.querySelector(`#${space}`).firstElementChild;
        if (gameBoard[space] === 'not guessed') {
            span.className = 'empty';
        }
        else if (gameBoard[space] === 'miss') {
            span.className = 'miss';
        }
        else {
            span.className = 'hit';
        }
    }
}

const makeMove = (e) => {
    let move = e.target.id;
    if (move === '') {
        move = e.target.parentElement.id;
    }

    if (player === '1') {
        shipSelection(move);
    }
    else {
        if (numMoves > 0 && correct < 3) {
            attack(move);
        }
    }
}

const shipSelection = (move) => {
    if (ship.length === 0) {
        ship.push(move);

        document.querySelector(`#${move}`).firstElementChild.className = 'hit';

        changeText(
            `Player 1, please enter the start square for your ship: ${move}`,
            true,
            'Player 1, please enter the end square for your ship:'
        );

        generateValidSelections(move);
    }
    else {
        if (validSelections.includes(move)) {

            validSelections.forEach(selection => {
                document.querySelector(`#${selection}`).classList.remove('highlight');
            });

            ship.push(move);

            document.querySelector(`#${move}`).firstElementChild.className = 'hit';

            const row1 = ship[0][0];
            const col1 = Number(ship[0][1]);
            const row2 = ship[1][0];
            const col2 = Number(ship[1][1]);

            let selection;

            if (row1 === row2) {
                const newCol = ((col1 < col2 ? col1 : col2) + 1).toString();
                selection = row1 + newCol;
            }
            else if (col1 == col2) {
                const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
                const newRow = letters[letters.indexOf(row1 < row2 ? row1 : row2) + 1];
                selection = newRow + col1;
            }

            ship.push(selection);

            document.querySelector(`#${selection}`).firstElementChild.className = 'hit';

            changeText(
                `Player 1, please enter the start square for your ship: ${ship[0]}`,
                true,
                `Player 1, please enter the end square for your ship: ${move}`
            )

            player2();
        }
    }
}

const generateValidSelections = (move) => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    const row = move[0];
    const col = move[1];

    if (letters[letters.indexOf(row) - 2]) {
        validSelections.push(letters[letters.indexOf(row) - 2] + col);
    }

    if (letters[letters.indexOf(row) + 2]) {
        validSelections.push(letters[letters.indexOf(row) + 2] + col);
    }

    if (Number(col) + 2 <= 6) {
        validSelections.push(row + ((Number(col) + 2).toString()));
    }

    if (Number(col) - 2 >= 0) {
        validSelections.push(row + ((Number(col) - 2).toString()));
    }

    validSelections.forEach(selection => {
        document.querySelector(`#${selection}`).classList.add('highlight');
    });
}

const player2 = () => {
    player = '2';

    setTimeout(() => {
        changeText(
            'Player 2, you have 10 guesses left. Please enter your guess by clicking on a square above.'
        )
        renderBoard();
    }, 1000);
}

const attack = (move) => {
    if (guesses.includes(move)) {
        changeText('Invalid guess!');
    }
    else {
        if (ship.includes(move)) {
            // hit
            gameBoard[move] = 'hit';
            numMoves--;
            correct++;
            guesses.push(move);
            changeText('That was a hit!');
        }
        else {
            // miss
            gameBoard[move] = 'miss';
            numMoves--;
            guesses.push(move);
            changeText('That was a miss!');
        }
    }

    const winStatus = (numMoves === 0 || correct === 3);

    if (winStatus) {
        win();
    }
    else {
        if (numMoves === 1) {
            setTimeout(() => changeText(
                `Player 2, you have ${numMoves} guess left. Please enter your guess by clicking on a square above.`
            ), 1000);
        }
        else {
            setTimeout(() => changeText(
                `Player 2, you have ${numMoves} guesses left. Please enter your guess by clicking on a square above.`
            ), 1000);
        }
    }

    renderBoard();
}

const win = () => {
    if (correct === 3) {
        changeWinText('Player 2 wins!');
    }
    else if (numMoves === 0) {
        changeWinText('Player 1 wins!');
    }
}

const changeText = (text, secondary = false, text2) => {
    const moveText = document.querySelector('.move');
    moveText.innerText = text;

    const secondaryText = document.querySelector('.secondary');
    if (secondary) {
        secondaryText.innerText = text2;
        secondaryText.style.display = 'block';
    }
    else {
        secondaryText.style.display = 'none';
    }
}

const changeWinText = (text) => {
    const winText = document.querySelector('.win');
    winText.innerText = text;
    winText.style.display = 'block';
}

let player = '1';
const gameBoard = [];
const ship = [];
const validSelections = [];
const guesses = [];
let numMoves = 10;
let correct = 0;

const spaces = document.querySelectorAll('.space');
spaces.forEach(space => space.addEventListener('click', (e) => makeMove(e)));

start();