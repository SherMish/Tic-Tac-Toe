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
}

module.exports = Room