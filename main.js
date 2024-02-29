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

    const bg = 0
    let board = []

    function createBoard() {
        let arr = [bg, bg, bg, bg, bg, bg, bg, bg, bg]
        board = arr
    }

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

    function checkWinner(player) {
        for (let combo of combos) {
            let isWinner = combo.every(index => board[index - 1] === player.marker)
            if (isWinner) {
                console.log('winner!')
                resetGame()
                return true
            }
        }
    }

    function changeTurn(player) {
        let currentPlayerIndex = players.findIndex(item => item.name === player.name);
        let nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
        player.myMove = false;
        players[nextPlayerIndex].myMove = true;
    }

    return {board, createBoard, updateBoard, logBoard, checkWinner}

})()

function createPlayer(name, marker) {
    let myMove = false

    function makeMove(pos) {
        if (this.myMove === true) {
            pos = pos - 1 //board arr is 0 indexed
            gameboard.updateBoard(this, pos)
            gameboard.logBoard()
            gameboard.checkWinner(this)
        } else {
            console.log('not your turn')
        }
    }

    return {name, marker, myMove, makeMove}
}


function resetGame() {
    gameboard.createBoard();
    players.forEach(player => {
        player.myMove = false;
    });
    players[0].myMove = true;

    gameboard.logBoard();
}




const p1 = createPlayer('p1', 'X')
const p2 = createPlayer('p2', 'O')
players.push(p1)
players.push(p2)

resetGame()


    // p1.myMove = true


p1.makeMove(1)
p2.makeMove(6)
p1.makeMove(2)
p2.makeMove(5)
p1.makeMove(3)

