const Board = require('./board')
const Player = require('./player')

class Room {
    constructor() {
        this.players= [],
        this.numOfPlayers = 0,
        this.gameStarted = false;
        this.board= new Board(),
        this.gameOverFlag = false;
    }

    addPlayer(name, id, piece) {
        this.players.push(new Player(name,id,piece));
        this.numOfPlayers++;
    }

    setGameStarted() {
        this.gameStarted = true;
    }

    isGameStarted() {
        return this.gameStarted;
    }

    deletePlayer(id) {
        const index = this.players.findIndex((player) => player.id === id);
         if(index !== -1) {
            this.numOfPlayers--;
            return this.players.splice(index, 1)[0];
         } 
    }

    getPlayerNameTurn() {
        return this.players[this.board.getTurn()].getName();
    }

    getPlayerIdTurn() {
        return this.players[this.board.getTurn()].getId();
    }

    getCurrentPiece() {
        return this.players[this.board.getTurn()].getPiece();
    }

    getNumOfPlayers() {
        return this.numOfPlayers;
    }

    addStep(index) {
        return this.board.updateBoard(index, this.getCurrentPiece());
    }

    isWinner() {
        return this.board.isWinner();
    }

    isDraw() {
        return this.board.isDraw();
    }

    getBoardArray() {
        return this.board.getArray();
    }

    gameOver() {
        this.gameOverFlag = true;
    }

    isGameOver() {
        return this.gameOverFlag;
    }
}

module.exports = Room