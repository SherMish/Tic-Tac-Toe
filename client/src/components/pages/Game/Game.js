import { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Board from '../../helpers/Board'


import './Game.css'

let socket;

function Game({location}) {

    const [msg, setMsg] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [players, setPlayers] = useState([])
    const [termination, setTermination]= useState(false); 
    const [roomId, setRoomId] = useState("");
    const ENDPOINT = 'localhost:5000';


const [gameArr, setGameArr] = useState([]); //
  const handleClick = (i) => {
      console.log('I IS:::', i)
      let obj= {
        i:i,roomId:roomId
      }
    socket.emit("step", obj);
  };

    useEffect( () => {
        const {name, roomId} = queryString.parse(location.search);
        setRoomId(roomId);

        socket = io(ENDPOINT);

        socket.emit("join", {name, roomId})

    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on("firstJoin", (msg) => {
            setMsg(msg);
        })

        socket.on("secondJoin", (serverPlayers, msg, gameArr)=> {
            setMsg(msg);
            setPlayers(serverPlayers);
            setGameStarted(true);
            setGameArr(gameArr);
        })

        socket.on("playerLeft", (serverPlayers) => {
            setPlayers(serverPlayers);
        })

        socket.on("afterStep", (gameArr, msg) => {
            console.log(gameArr);
            setGameArr(gameArr);
            setMsg(msg);
        })

        socket.on("gameInProgress", () => {
            setTermination(true);
            alert("The room is full. Please try again later");
        })

        socket.on("gameOver", (msg, gameArr) => {
            setMsg(msg);
            setGameArr(gameArr);
        })
    }, []);

    useEffect( () => {
        if (players.length < 2 && gameStarted) { //the opponent has left - terminate the game 
            setTermination(true);
            alert("Opponent left! The game was terminated");
        }
    },[players, gameStarted]);

    if(termination) {
        return (
        <div className="message">
            <h1>The game was terminated.</h1>
        </div>
        );
    }
    
    if(gameStarted && !termination) {
        return (
            <>
            <div className="message">
                <h1>{msg}</h1>
            </div>
            <div className="boardClass">
                <Board squares={gameArr} onClick={handleClick} />
            </div>
            </>
        );
    }
            
    return (
        <div className="message">
                <h1>{msg}</h1>
        </div>

    );
}

export default Game;