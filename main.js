let players = []
let names = []


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
                player.givePoint()
                gameEnd()
                uiGameEnd(player)
                updateScoreDisplay(players[0].getScore(), players[1].getScore())
                return true
            } else if (checkTie()) {
                console.log('tie!!')
                gameEnd()
                uiGameEnd(player, 'tie')
                updateScoreDisplay(players[0].getScore(), players[1].getScore())
            }
        }
    }

    function newBoard() {
        let obj = [bg, bg, bg, bg, bg, bg, bg, bg, bg]
        board = obj
    }

    return {board, newBoard, updateBoard, logBoard, readBoard, checkWinner}

})()



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

function checkTie() {
    let stateOfBoard = gameboard.readBoard()
    return !stateOfBoard.includes('0')
}

function createPlayer(name, marker) {
    let myMove = false
    let isWinner = false
    let score = 0

    let givePoint = function() {
        score++
    }

    let getScore = () => score

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

    return {name, marker, myMove, makeMove, getScore, givePoint}
}

function createPlayers(first, second) {
    let p1 = createPlayer(first, 'X')
    let p2 = createPlayer(second, 'O')
    p1.myMove = true

    players.push(p1)
    players.push(p2)
}

function createGameBoard() {
    gameboard.newBoard()
    gameboard.logBoard();
}

function initGame(p1, p2) { //differentiate init vs startingn new game with same players
    createGameBoard()
    createPlayers(p1, p2)
}

function newGame() {
    createGameBoard()
    players[0].myMove = true
    players[1].myMove = false
    // createPlayers()
}

function gameEnd() {
    players[0].myMove = false
    players[1].myMove = false
}

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
        let className = marker === 'X' ? 'cross' : 'nought'
        target.classList.add(className)
        applyShadow(target)
        console.log(target)
    } else if (marker === 0) {
        target.classList.add('empty')
    }
}

function uiResetCells() {
    let cells = document.querySelectorAll('.cell')
    cells.forEach(cell => cell.textContent = '')
}

function uiGameEnd(player, tied) {
    // const board = document.querySelector('.board')
    // board.classList.add('hide')

    let msg = tied ? `Draw` : `${player.name} Wins` 

    const modal = document.querySelector('#restart-modal')
    modal.style.opacity= 0; 


    const resultBanner = modal.querySelector('.result-banner')
    resultBanner.textContent = msg

    modalFadeIn(modal)

    setTimeout(() => {
        startNewRound()
        modalFadeOut(modal)
    }, 3000)
}



function startNewRound() {
        newGame()
        uiNewGame()  //remove noughts and crosses
}

function modalFadeIn(modal) {
    modal.style.transition='opacity 2s'; //handle transitions

    modal.showModal()
    modal.style.opacity= 1;
}

function modalFadeOut(modal) {
    modal.style.transition='opacity 1s ease-in'; //handle transitions

    modal.style.opacity = 0;
    setTimeout(() => {
        modal.close();
    }, 1000);
}

function uiNewGame() {
    let cells = document.querySelectorAll('.cell')
    let i = 100
    for (let cell of cells) {
        setTimeout(() => {
            rmNoughtCross(cell)
            rmShadow(cell)
        }, i)
    }
}



function uiStartScreen() {

    const p1Dialog = document.querySelector('#p1-dialog')
    const p1Input = document.querySelector('#p1-input')


    const p2Dialog = document.querySelector('#p2-dialog')
    const p2Input = document.querySelector('#p2-input')

    p1Dialog.showModal()

    p1Dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let p1Name = p1Input.value;
            names.push(p1Name)

            p1Dialog.close()
            p2Dialog.showModal()
        }
    })

    p2Dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            let p2Name = p2Input.value;
            names.push(p2Name)

            p2Dialog.close()
            initGame(names[0], names[1])
            initPlayerCards(names)
        }
    })
}

function initPlayerCards(pnames) {
    const p1NameCard = document.querySelector('#p1-name')
    const p2NameCard = document.querySelector('#p2-name')
    p1NameCard.textContent = pnames[0]
    p2NameCard.textContent = pnames[1]

    const p1ScoreCard = document.querySelector('#p1-score')
    const p2ScoreCard = document.querySelector('#p2-score')
    p1ScoreCard.textContent = tally(0)
    p2ScoreCard.textContent = tally(0)
}

function updateScoreDisplay(p1Score, p2Score) {

    const p1ScoreCard = document.querySelector('#p1-score')
    const p2ScoreCard = document.querySelector('#p2-score')

    p1ScoreCard.textContent = tally(p1Score)
    p2ScoreCard.textContent = tally(p2Score)
}

function tally(num) {
    let mark = ''
    switch (num) {
        case 0:
            mark = '.'
            break;
        case 1:
            mark = '𝍠'
            break;
        case 2:
            mark = '𝍠𝍠'
            break;
        case 3:
            mark = '𝍠𝍠𝍠'
            break;
        case 4:
            mark = '𝍠𝍠𝍠𝍠'
            break;
        case 5:
            mark = '卌'
            break;
    }
    return mark
}

function uiInit() {
    uiCreateBoard()
    uiStartScreen()
}

function rmNoughtCross(el) {
    el.classList.remove('nought')
    el.classList.remove('cross')
}

function rmShadow(el) {
    el.style.cssText = `box-shadow: none;`
}

function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1, str.length)
}

function applyShadow(el) {

    let one = `box-shadow:rgba(0, 0, 0, 0.35) 0px -50px 36px -28px inset;`

    let two = `box-shadow:rgba(0, 0, 0, 0.35) 0px 50px 36px -28px inset;`

    let three = `box-shadow:rgba(0, 0, 0, 0.35) -50px 0px 36px -28px inset;`

    let four = `box-shadow:rgba(0, 0, 0, 0.35) 50px 0px 36px -28px inset;`

    let shadows = [one, two, three, four]

    let num = getRandomIntInclusive(0, 3)

    el.style.cssText = shadows[num]
    console.log(shadows[num])
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}


// initGame()
uiInit()

//set focus on name input
// players[0].makeMove(1)
// players[1].makeMove(6)
// players[0].makeMove(2)
// players[1].makeMove(5)
// players[0].makeMove(3)
