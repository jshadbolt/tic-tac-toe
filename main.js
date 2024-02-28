
let gameBoard = (function() {
    const bg = 0
    let board = [bg, bg, bg, bg, bg, bg, bg, bg, bg]

    const updateBoard = (player, pos) => {
        if (player.myTurn === true) {
            pos = pos - 1
            if (board[pos] === bg) {
                board[pos] = player.marker
                changeTurn()
            } else {
                console.log('cannot place here')
            }
        } else {
            console.log('not your turn')
        }
        checkWinner(player)
    }

    const logBoard = () => console.log(`${board.slice(0, 3)}\n${board.slice(3, 6)}\n${board.slice(6, 9)}`)

    return {updateBoard, logBoard, board}
})()

function createPlayer(name, marker) {

    let myTurn = false

    function makeMove(pos) {
        gameBoard.updateBoard(this, pos)
        gameBoard.logBoard()
    }

    return {name, marker, myTurn, makeMove}
}


function checkWinner(player) {

    let marker = player.marker
    for (let combo of combos) {
        let isWinner = combo.every(index => gameBoard.board[index - 1] === marker)
        if (isWinner) {
            console.log(`${player.name} wins!`)
            return true
        }
    }
    return false
}

function changeTurn() {

    if (p1.myTurn) {
        p1.myTurn = false
        p2.myTurn = true
    } else {
        p1.myTurn = true
        p2.myTurn = false
    }    
}


let combos = [
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


let p1 = createPlayer('p1', 'X')
let p2 = createPlayer('p2', 'O')

gameBoard.logBoard()

p1.myTurn = true


