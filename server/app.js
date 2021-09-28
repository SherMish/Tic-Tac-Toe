const express = require("express");
const http = require('http');
const cors = require('cors');

const Room = require('./utilities/room');
const Rooms = require("./utilities/rooms");

const PORT = process.env.PORT || 5000;
const ROOM_ID = Math.random().toString(36).slice(2);

const app = express();
const server = http.createServer(app)

var io = require('socket.io')(server, {
    'cors': 
    { 'methods': ['GET', 'PATCH', 'POST', 'PUT'], 
    'origin': true //any origin
    } 
}); 

app.use(cors());

let rooms_arr = new Rooms();

io.on("connection", (socket) => {
    
    // if(room.isGameStarted()) {
    //     socket.emit("gameInProgress");
    // }

    

    socket.on("join", ({name, roomId}) => {
        
        let room = rooms_arr.findRoomById(roomId);
        if(!room) { //new room
            //create a new one
            rooms_arr.addRoom(roomId,name, socket.id, 'X') // creates a new room and adds a first player
            socket.join(roomId);
            socket.emit("firstJoin", "Waiting for a second player...");
        }
        
        else  { // one player already joined before the current one
            socket.join(roomId);
            rooms_arr.addPlayer(roomId, name, socket.id, 'O');
            //first emit to the other player
            socket.in(roomId).emit("secondJoin", rooms_arr.getPlayers(roomId), `Good luck! ${rooms_arr.getPlayerNameTurn(roomId)}'s turn`, rooms_arr.getBoardArray(roomId));
            //then emit to the current player
            socket.emit("secondJoin", rooms_arr.getPlayers(roomId), `Good luck! ${rooms_arr.getPlayerNameTurn(roomId)}'s turn`, rooms_arr.getBoardArray(roomId));
       }
    })

    socket.on("step", (obj) => {
        let roomId = obj.roomId;
        let index = obj.i;
        
        let playerName = rooms_arr.getPlayerNameTurn(roomId);
        if (rooms_arr.getPlayerIdTurn(roomId) != socket.id || rooms_arr.isGameOver(roomId)) {
            //Opponent`s turn or game over- do nothing
            return;
        }
        
        let result = rooms_arr.addStep(roomId,index);
        if (!result) {
            //Tile occupied - do nothing
            return;
        }
        //else, the game board was updated.
        
        if (rooms_arr.isWinner(roomId)) { //the current player has won
            rooms_arr.gameOver(roomId);
            //first emit to the other player
            socket.in(roomId).emit("gameOver", `Game over, ${playerName} won!`, rooms_arr.getBoardArray(roomId));
            //then emit to the current player
            socket.emit("gameOver", `Game over, ${playerName} won!`,rooms_arr.getBoardArray(roomId) );
            return;
        }
        if (rooms_arr.isDraw(roomId)) {
            
            rooms_arr.gameOver(roomId);
            //first emit to the other player
            socket.in(roomId).emit("gameOver", `Game over! Draw`, rooms_arr.getBoardArray(roomId));
            //then emit to the current player
            socket.emit("gameOver", `Game over! Draw`, rooms_arr.getBoardArray(roomId));
            return;
        }

        //first emit to the other player
        socket.in(roomId).emit("afterStep", rooms_arr.getBoardArray(roomId), `${rooms_arr.getPlayerNameTurn(roomId)}'s turn`);
        //then emit to the current player
        socket.emit("afterStep", rooms_arr.getBoardArray(roomId), `${rooms_arr.getPlayerNameTurn(roomId)}'s turn `);
    })

    // socket.on("disconnect", () => {
    //     let room = rooms_arr.findRoomByUserId(socket.id); // room in which the player who left was

    //     // room.deletePlayer(socket.id);
    //     // emit to the other player
    //     socket.in(room.id).emit("playerLeft", room.players)
    //     // if(room.getNumOfPlayers() == 0) {
    //     //     room = new Room();
    //     // }
    // })
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))