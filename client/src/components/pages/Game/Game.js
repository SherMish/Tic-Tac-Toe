import { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

function Game({location}) {

    const [name, setName] = useState("");
    //const [room, setRoom] = useState("");
    const [msg, setMsg] = useState("");
    const ENDPOINT = 'localhost:5000';

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
    }, []);


    return (
        <div>
            <h1>{msg}</h1>
        </div>

    );
}

export default Game;