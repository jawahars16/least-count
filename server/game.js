const uuidv4 = require("uuid/v4")

function game(io) {

    let clients = {};
    let state = {
        deck: [],
        users: [],
        activePlayDeck: [],
        previousPlayDeck: [],
        isActive: false
    };

    function newClient(client) {
        console.log('💻 New client joined...');

        client.on('new-user', data => onUserJoined(data, client));
        client.on('game-state', onGameStateUpdatedFromClient)
        client.on('disconnect', onDisconnect);

        if (state.deck.length > 0) {
            broadCastGameState();
        }
    }

    function onGameStateUpdatedFromClient(stateObj) {
        console.clear();
        console.log(stateObj.previousPlayDeck);
        console.log('🎲 Game state changed...');
        state = JSON.parse(JSON.stringify(stateObj));
        broadCastGameState();
        console.log(state.previousPlayDeck);
    }

    function onUserJoined(user, client) {

        if(state.deck.length > 0) {

            return;
        }

        const existingUser = state.users && state.users.find(u => u.id === user.id);

        if (!existingUser) {
            console.log('🤝 New user joined');
            state.users = [...state.users, user];
        }

        clients[user.id] = client;
        broadCastGameState();
    }

    function broadCastGameState() {
        io.emit('game-state', state);
    }

    function onDisconnect(client) {
        console.log('😥 User disconnected');
        console.log('Client disconnected...');
    }

    return {
        onUserJoined,
        newClient
    }
}

module.exports = game;