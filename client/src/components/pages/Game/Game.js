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
const [history, setHistory] = useState([Array(9).fill(null)]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXisNext] = useState(true);
  const winner = calculateWinner(history[stepNumber]);
  const xO = xIsNext ? "X" : "O";

  const handleClick = (i) => {
    const historyPoint = history.slice(0, stepNumber + 1);
    const current = historyPoint[stepNumber];
    const squares = [...current];
    // return if won or occupied
    if (winner || squares[i]) return;
    // select square
    squares[i] = xO;
    setHistory([...historyPoint, squares]);
    setStepNumber(historyPoint.length);
    setXisNext(!xIsNext);
  };

  const jumpTo = (step) => {
    setStepNumber(step);
    setXisNext(step % 2 === 0);
  };

  const renderMoves = () =>
    history.map((_step, move) => {
      const destination = move ? `Go to move #${move}` : "Go to Start";
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{destination}</button>
        </li>
      );
    });

//************************************* */


    useEffect( () => {
        const {name} = queryString.parse(location.search);
        setName(name);
        //setRoom(room);

        socket = io(ENDPOINT);
        console.log(socket);

        socket.emit("join", {name})

    }, [ENDPOINT, location.search]);

    useEffect( () => {
        socket.on("firstJoin", (msg) => {
            setMsg(msg);
        })

        socket.on("secondJoin", (serverPlayers) => {
            setMsg("Good luck!");
            setGameStarted(true);
            setPlayers(serverPlayers);
            //console.log(serverPlayers);

        socket.on("playerLeft", (serverPlayers) => {
            setPlayers(serverPlayers);
        })

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
                <div className="">
                    <Board squares={history[stepNumber]} onClick={handleClick} />
                </div>
                <div className="info-wrapper">
                    {/* <div>
                        <h3>History</h3>
                        {renderMoves()}
                    </div>
                    <h3>{winner ? "Winner: " + winner : "Next Player: " + xO}</h3> */}
                </div>
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