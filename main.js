let players = []


const gameboard = (function() {
    const combos = [
        //horizontal
        [1, 2, 3],
        [4, 5, 6],  
        [7, 8, 9],
        //vertical
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        //diagonal
        [1, 5, 9],
        [3, 5, 7],
    ]

    let board = []
    let bg = '0'

    function updateBoard(player, pos) {
        let validMove = (board[pos] === bg)
        if (validMove) {
            board[pos] = player.marker
            changeTurn(player)
        } else {
            console.log('cannot place here')
        }
    }

    let logBoard = function() {
        let display = `${board.slice(0, 3)}\n${board.slice(3, 6)}\n${board.slice(6, 9)}`
        console.log(display)
    } 

    let readBoard = () => board

    function checkWinner(player) {
        for (let combo of combos) {
            let isWinner = combo.every(index => board[index - 1] === player.marker)
            if (isWinner) {
                console.log('winner!')
                return true
            }
        }
    }

    function changeTurn(player) {
        let p1 = players[0]
        let p2 = players[1]
        switch (player) {
            case p1:
                p1.myMove = false
                p2.myMove = true
                break;
            case p2:
                p1.myMove = true
                p2.myMove = false
                break;
        }
    }

    function newBoard() {
        let obj = [bg, bg, bg, bg, bg, bg, bg, bg, bg]
        board = obj
    }

    return {board, newBoard, updateBoard, logBoard, readBoard, checkWinner}

})()


function createPlayer(name, marker) {
    let myMove = false

    function makeMove(pos) {
        if (this.myMove === true) {
            pos = pos - 1 //board arr is 0 indexed
            gameboard.updateBoard(this, pos)
            gameboard.logBoard()
        } else {
            console.log('not your turn')
        }
        gameboard.checkWinner(this)
    }

    return {name, marker, myMove, makeMove}
}

function createPlayers() {
    players = []
    let p1 = createPlayer('p1', 'X')
    let p2 = createPlayer('p2', 'O')
    p1.myMove = true

    players = [p1, p2]
}

function createGameBoard() {
    gameboard.newBoard()
    gameboard.logBoard();
}

function newGame() {
    createGameBoard()
    createPlayers()
}



newGame()
uiCreateBoard()

// players[0].makeMove(1)
// players[1].makeMove(6)
// players[0].makeMove(2)
// players[1].makeMove(5)
// players[0].makeMove(3)


function uiCreateBoard() {
    const gridSize = 9
    let uiBoard = document.querySelector('.board')

    for (let i = 1 ; i < gridSize + 1 ; i++) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('index', i)
        cell.addEventListener('click', () => {
            let currPlayer = players.find(player => player.myMove === true)
            let index = cell.getAttribute('index')
            currPlayer.makeMove(index)
            uiUpdateCell(index)
        })
        uiBoard.appendChild(cell)
    }

}


function uiUpdateCell(index) {
    const target = document.querySelector(`.cell[index="${index}"]`);
    let board = gameboard.readBoard()
    let marker = board[index - 1]
    if (marker !== 0) {
        target.textContent = marker
    } else if (marker === 0) {
        target.textContent = 'empty'
    }
}

function uiResetCells() {
    let cells = document.querySelectorAll('.cell')
    cells.forEach(cell => cell.textContent = '')
}





