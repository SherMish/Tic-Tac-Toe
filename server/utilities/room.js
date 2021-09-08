const Board = require('./board')
const Player = require('./player')

class Room {
    constructor() {
        this.players= [],
        this.numOfPlayers = 0,
        this.gameStarted = false;
        this.board= new Board(),
        this.is_game_over = false;
    }

    addPlayer(name, id, piece) {
        this.players.push(new Player(name,id,piece));
        this.numOfPlayers++;
    }

    setGameStarted(bool) {
        this.gameStarted = true;
    }

    getGameStarted() {
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
        this.is_game_over = true;
        return true;
    }

    isGameOver() {
        return this.is_game_over;
    }


}

module.exports = Room