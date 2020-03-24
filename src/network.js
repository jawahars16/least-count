import client from "socket.io-client";

function network() {

    let socket;

    function initialize(gameStateUpdated, roundEndHandler, errorHandler) {

        let endPoint = '/';

        if (document.location.origin.includes('localhost')) {
            endPoint = 'http://localhost:3000';
        }

        socket = client(endPoint);
        socket.on('game-state', gameStateUpdated);
        socket.on('round-end', roundEndHandler);
        socket.on('connect_error', errorHandler);
    }

    function broadCastNewUser(user) {
        socket.emit('new-user', user)
    }

    function broadcastGameState(state) {
        socket.emit('game-state', state)
    }

    function broadcastDeclare(state) {
        socket.emit('declare', state)
    }

    return {
        initialize,
        broadcastGameState,
        broadCastNewUser,
        broadcastDeclare
    }
}

export default network;