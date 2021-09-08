const Board = require('./board')
const Player = require('./player')

class Room {
    constructor() {
        this.players= [],
        this.numOfPlayers= 0,
        this.gameStarted= false,
        this.board= new Board()
    }

    addPlayer(name, id, piece) {
        this.players.push(new Player(name,id,piece));
        this.numOfPlayers++;
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
        return this.board.isWinner()
    }

    getBoardArray() {
        return this.board.getArray();
    }

}

module.exports = Room