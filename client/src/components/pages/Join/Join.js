import React, { useState } from 'react';
import { Link } from "react-router-dom";

import './Join.css'

function Join() {
    const [name, setName] = useState('');

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

export default Join;