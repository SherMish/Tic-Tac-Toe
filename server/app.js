const express = require("express");
const http = require('http');
const cors = require('cors');

const Player = require('./utilities/player')
const Board = require('./utilities/board')
const Room = require('./utilities/room')


const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app)

var io = require('socket.io')(server, {
    'cors': 
    { 'methods': ['GET', 'PATCH', 'POST', 'PUT'], 
    'origin': true //any origin..
    } 
}); 


app.use(cors());

let room = new Room();


io.on("connection", (socket) => {
    if(room.getGameStarted) {
        socket.emit("gameInProgress", "A game is in progress, please try again later");

    }
    socket.join(12345)

    socket.on("join", ({name}) => {
       if (room.numOfPlayers == 0) {
           room.addPlayer(name, socket.id, 'X');
           socket.emit("firstJoin", "Waiting for a second player...");
       }

       //TODO: check if same usernames
       else if (room.numOfPlayers == 1) {
            room.addPlayer(name, socket.id, 'O');
            room.setGameStarted(true);
            socket.in(12345).emit("secondJoin", room.players, `Good luck! ${room.getPlayerNameTurn()}'s turn`, room.getBoardArray());
            socket.emit("secondJoin", room.players, `Good luck! ${room.getPlayerNameTurn()}'s turn`, room.getBoardArray());

       }
       //TODO: if another player tries to join
    })

    socket.on("step", (index => {
        let player_played_name = room.getPlayerNameTurn();
        if (room.getPlayerIdTurn() != socket.id || room.isGameOver()) {
            //Opponent`s turn or game over- do nothing!
            return;
        }
        

        let result = room.addStep(index);
        if (!result) {
            //Tile occupied - do nothing!
            return;
        }
        //else, the game board was updated.
        if (room.isWinner()) { //the current player has won
            room.gameOver();
            socket.in(12345).emit("gameOver", `Game over, ${player_played_name} won!`, room.getBoardArray());
            socket.emit("gameOver", `Game over, ${player_played_name} won!`,room.getBoardArray() );
            return;
        }
        if (room.isDraw()) {
            console.log(room.getBoardArray());
            room.gameOver();
            socket.in(12345).emit("gameOver", `Game over! Draw`, room.getBoardArray());
            socket.emit("gameOver", `Game over! Draw`, room.getBoardArray());
            return;
        }

        socket.in(12345).emit("afterStep", room.getBoardArray(), `${room.getPlayerNameTurn()}'s turn`);
            socket.emit("afterStep", room.getBoardArray(), `${room.getPlayerNameTurn()}'s turn `);


    }))


    socket.on("disconnect", () => {
        console.log("the user has disconnected!");
        room.deletePlayer(socket.id);
        socket.in(12345).emit("playerLeft", room.players)

        if(room.numOfPlayers == 0) {
            room = new Room();
        }


    })
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))