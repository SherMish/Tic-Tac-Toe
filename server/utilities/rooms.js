const Room = require('./room')

class Rooms {
    constructor() {
        this.rooms = []
    }

    getNumOfRooms() {
        return this.rooms.length;
    }

    addRoom(roomId, name, id, piece) {
        let room = new Room(roomId);
        room.addPlayer(name,id,piece);
        this.rooms.push(room);
    }

    findRoomById(roomId) {
        for (let x of this.rooms) {
            if (x.id === roomId) {
                return x;
            }
        }
    }

    addPlayer(roomId, name, id, piece) {
        let room = this.findRoomById(roomId);
        room.addPlayer(name, id, piece);
        room.setGameStarted(true);
    }

    getPlayerNameTurn(roomId) {
        let room = this.findRoomById(roomId);
        return room.getPlayerNameTurn();

    }

    getBoardArray(roomId) {
        let room = this.findRoomById(roomId);
        return room.getBoardArray();
    }

    getPlayers(roomId) {
        let room = this.findRoomById(roomId);
        return room.players;

    }

    getPlayerIdTurn(roomId) {
        let room = this.findRoomById(roomId);
        return room.getPlayerIdTurn();
    }

    isGameOver(roomId) {
        let room = this.findRoomById(roomId);
        return room.isGameOver();
    }

    addStep(roomId,index) {
        let room = this.findRoomById(roomId);
        return room.addStep(index);
    }

    isWinner(roomId) {
        let room = this.findRoomById(roomId);
        return room.isWinner()
    }

    gameOver(roomId) {
        let room = this.findRoomById(roomId);
        room.gameOver();
    }

    isDraw(roomId) {
        let room = this.findRoomById(roomId);
        return room.isDraw();
    }

    findRoomByUserId(id){
        for (let x of this.rooms) {
            if (x.isPlayerIdInRoom(id)) return x;
        }
        return null;
    }
}


module.exports = Rooms