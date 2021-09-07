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
}

module.exports = Room