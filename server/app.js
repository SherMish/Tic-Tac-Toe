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

    socket.on("join", ({name}) => {
        console.log(room.numOfPlayers)
        console.log(room);
       if (room.numOfPlayers == 0) {
           console.log('in if');
           room.addPlayer(name, socket.id, 'x');
           socket.join(12345)
           socket.emit("firstJoin", "Waiting for a second player...");
       }

    })


    socket.on("disconnect", () => {
        console.log("the user has disconnected!");
        //TODO
        //room.deleteUser(socket.id);


    })
});

server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))