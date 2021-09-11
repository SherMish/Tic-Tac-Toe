const express = require("express");
const http = require('http');
const cors = require('cors');

const Room = require('./utilities/room')

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

let room = new Room();

io.on("connection", (socket) => {
    if(room.isGameStarted()) {
        socket.emit("gameInProgress");
    }

    socket.join(ROOM_ID);

    socket.on("join", ({name}) => {
       if (room.getNumOfPlayers() == 0) { //if fist player joining
           room.addPlayer(name, socket.id, 'X'); // first player starts first
           socket.emit("firstJoin", "Waiting for a second player...");
       }

       else if (room.getNumOfPlayers() == 1) { // one player already joined before the current one
            room.addPlayer(name, socket.id, 'O');
            room.setGameStarted(true);
            //first emit to the other player
            socket.in(ROOM_ID).emit("secondJoin", room.players, `Good luck! ${room.getPlayerNameTurn()}'s turn`, room.getBoardArray());
            //then emit to the current player
            socket.emit("secondJoin", room.players, `Good luck! ${room.getPlayerNameTurn()}'s turn`, room.getBoardArray());
       }
    })

    socket.on("step", (index => {
        let playerName = room.getPlayerNameTurn();
        if (room.getPlayerIdTurn() != socket.id || room.isGameOver()) {
            //Opponent`s turn or game over- do nothing
            return;
        }
        
        let result = room.addStep(index);
        if (!result) {
            //Tile occupied - do nothing
            return;
        }
        //else, the game board was updated.
        if (room.isWinner()) { //the current player has won
            room.gameOver();
            //first emit to the other player
            socket.in(ROOM_ID).emit("gameOver", `Game over, ${playerName} won!`, room.getBoardArray());
            //then emit to the current player
            socket.emit("gameOver", `Game over, ${playerName} won!`,room.getBoardArray() );
            return;
        }
        if (room.isDraw()) {
            console.log(room.getBoardArray());
            room.gameOver();
            //first emit to the other player
            socket.in(ROOM_ID).emit("gameOver", `Game over! Draw`, room.getBoardArray());
            //then emit to the current player
            socket.emit("gameOver", `Game over! Draw`, room.getBoardArray());
            return;
        }

        //first emit to the other player
        socket.in(ROOM_ID).emit("afterStep", room.getBoardArray(), `${room.getPlayerNameTurn()}'s turn`);
        //then emit to the current player
        socket.emit("afterStep", room.getBoardArray(), `${room.getPlayerNameTurn()}'s turn `);
    }))

    socket.on("disconnect", () => {
        console.log("the user has disconnected!");
        room.deletePlayer(socket.id);
        //emit to the other player
        socket.in(ROOM_ID).emit("playerLeft", room.players)
        if(room.getNumOfPlayers() == 0) {
            room = new Room();
        }
    })
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))