import { useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom'
import queryString from 'query-string';
import io from 'socket.io-client';
import Board from '../../helpers/Board'
import {calculateWinner} from '../../helpers/helper'

import './Game.css'

let socket;

function Game({location}) {

    const [name, setName] = useState("");
    //const [room, setRoom] = useState("");
    const [msg, setMsg] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [players, setPlayers] = useState([])
    const [termination, setTermination]= useState(false); 
    const ENDPOINT = 'localhost:5000';

//************************************ */
const [history, setHistory] = useState([Array(9).fill(null)]); // array in which the first element is array of size 9 with nulls
  //const [stepNumber, setStepNumber] = useState(0);
  //const [xIsNext, setXisNext] = useState(true);
  //const winner = calculateWinner(history[stepNumber]);
  //const xO = xIsNext ? "X" : "O";

  const handleClick = (i) => {
    socket.emit("step", i);

    // const historyPoint = history.slice(0, stepNumber + 1);
    // const current = historyPoint[stepNumber];
    // const squares = [...current];
    // // return if won or occupied
    // if (winner || squares[i]) return;
    // // select square
    // squares[i] = xO;
    // setHistory([...historyPoint, squares]);
    // setStepNumber(historyPoint.length);
    // setXisNext(!xIsNext);
  };



//************************************* */


    useEffect( () => {
        const {name} = queryString.parse(location.search);
        setName(name);
        //setRoom(room);

        socket = io(ENDPOINT);

        socket.emit("join", {name})

    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on("firstJoin", (msg) => {
            setMsg(msg);
        })

        socket.on("secondJoin", (serverPlayers, msg, history)=> {
            setMsg(msg);
            setGameStarted(true);
            setPlayers(serverPlayers);
            setHistory(history);
            //console.log(serverPlayers)

        })

        socket.on("playerLeft", (serverPlayers) => {
            setPlayers(serverPlayers);
        })

        socket.on("afterStep", (history, msg) => {
            console.log(history);
            console.log(msg);
            setHistory(history);
            setMsg(msg);

        })
    }, []);

    useEffect( () => {
        if (players.length < 2 && gameStarted) { //the opponent has left - terminate the game 
            setTermination(true);
            alert("Opponent left! The game was terminated");

        }
    },[players]);

    if(termination) {
        return (
        <div>
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
                <Board squares={history} onClick={handleClick} />
            </div>
            </>
        );
    }
            
    return (
        <div>
            <h1>{msg}</h1>
        </div>

    );
}

export default Game;