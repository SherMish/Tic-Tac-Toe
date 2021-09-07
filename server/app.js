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
    console.log("CONNECTED, YAY!")
    socket.join(12345)

    socket.on("join", ({name}) => {
       if (room.numOfPlayers == 0) {
           console.log("first if")
           room.addPlayer(name, socket.id, 'x');
           socket.emit("firstJoin", "Waiting for a second player...");
       }

       //TODO: check if same usernames
       else if (room.numOfPlayers == 1) {
            console.log("second if")
            room.addPlayer(name, socket.id, 'o');
            socket.in(12345).emit("secondJoin", room.players);
            socket.emit("secondJoin", room.players);

       }
    })


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