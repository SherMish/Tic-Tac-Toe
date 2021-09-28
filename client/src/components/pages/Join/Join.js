import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Join.css'

function Join() {
    const [name, setName] = useState('');
    const [newGame, setNewGame] = useState(true);
    const [roomId, setRoomId] = useState('');


    if(newGame) {
    return (
        <div className="joinOuterContainer">
            <div className="joinInnerContainer">
                <h1 className="heading">Tic Tac Toe</h1>
                <h3 className="credit">By Sharon Mishayev</h3>
                <div>
                    <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
                    <input placeholder="Type New Room ID Or An Exising One" className="joinInput" type="text" onChange={(event) => setRoomId(event.target.value)} />
                </div>
                <Link onClick={e => (!name || !roomId) ? e.preventDefault() : null} to={`/game?name=${name}&roomId=${roomId}`}>
                    <button className={'button mt-20'} type="submit">Play Now</button>
                </Link>
            </div>
        </div>

    );
    }

    if(!newGame) {
        return (
            <div className="joinOuterContainer">
                <div className="joinInnerContainer">
                    <h1 className="heading">Tic Tac Toe</h1>
                    <h3 className="credit">By Sharon Mishayev</h3>
                    <div>
                        <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
                    </div>
                    <Link onClick={e => (!name) ? e.preventDefault() : null} to={`/game?name=${name}`}>
                        <button className={'button mt-20'} type="submit">Play Now</button>
                    </Link>
                </div>
            </div>
    
        );
        }


}

export default Join;