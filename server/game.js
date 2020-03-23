const uuidv4 = require("uuid/v4")

function game(io) {

    let clients = {};
    let state = {
        deck: [],
        users: [],
        activePlayDeck: [],
        previousPlayDeck: [],
        isActive: false,
        activePlayer: null,
        previousPlayer: null
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

    function assignNextPlayer() {
        if (state.deck.length > 0 && state.activePlayDeck.length <= 0) {
            let nextPlayer = null;
            let orderPointer = 0;

            const activePlayer = state.users.find(u => u.id === state.activePlayer);
            if (activePlayer) {
                orderPointer = activePlayer.order;
            }

            while (!nextPlayer) {
                orderPointer += 1;
                nextPlayer = state.users.find(u => u.order === orderPointer);

                if (orderPointer >= state.users.length) {
                    orderPointer = 0;
                }
            }

            if (!nextPlayer) {
                nextPlayer = activePlayer;
            }

            state.previousPlayer = state.activePlayer && state.activePlayer.toString();
            state.activePlayer = nextPlayer.id;
            console.log(`Active player - ${state.activePlayer}`);
            console.log(`Previous player - ${state.previousPLayer}`);
        }
    }

    function onGameStateUpdatedFromClient(stateObj) {
        console.clear();
        console.log('🎲 Game state changed...');
        state = JSON.parse(JSON.stringify(stateObj));
        assignNextPlayer();
        broadCastGameState();
    }

    function onUserJoined(user, client) {
        if (state.deck.length > 0) {
            return;
        }

        const existingUser = state.users && state.users.find(u => u.id === user.id);

        if (!existingUser) {
            console.log('🤝 New user joined');
            user.order = state.users.length + 1;
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