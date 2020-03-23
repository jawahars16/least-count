import client from "socket.io-client";

function network() {

    let socket;

    function initialize(gameStateUpdated, errorHandler) {

        let endPoint = '/';

        if (document.location.origin.includes('localhost')) {
            endPoint = 'http://localhost:3003';
        }

        socket = client(endPoint, {
            'reconnection': true,
            'reconnectionDelay': 500,
            'reconnectionAttempts': 5
        });
        socket.on('game-state', gameStateUpdated);
        socket.on('connect_error', errorHandler);
    }

    function broadCastNewUser(user) {
        socket.emit('new-user', user)
    }

    function broadcastGameState(state) {
        socket.emit('game-state', state)
    }

    return {
        initialize,
        broadcastGameState,
        broadCastNewUser
    }
}

export default network;