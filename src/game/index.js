import Cards from './cards';
import options from "./options";

function game(network) {

    let state = {
        deck: [],
        users: [],
        activePlayDeck: [],
        previousPlayDeck: [],
        joker: null,
        isActive: false,
    };
    let deck;
    let cards = Cards();

    function clone(source) {
        return JSON.parse(JSON.stringify(source));
    }

    function start() {
        let newState = clone(state);
        newState.isActive = true;
        network.broadcastGameState(state);
        deck = cards.newDeck(true);
        let index = 0;
        newState.users.forEach(user => {
            user.hand = deck.cards.slice(index, index + options.handCardsLimit).map(c => c.i);
            index = index + options.handCardsLimit;
        });
        newState.joker = deck.cards.slice(index, index + 1)[0].i;
        index = index + 1;
        newState.previousPlayDeck = deck.cards.slice(index, index + 1).map(c => c.i);
        index = index + 1;
        newState.deck = deck.cards.slice(index).map(c => c.i);
        updateState(newState);
        network.broadcastGameState(state);
    }

    function registerUser(user) {
        network.broadCastNewUser(user);
    }

    function updateState(stateObj) {
        state = JSON.parse(JSON.stringify(stateObj));
    }

    function getState() {
        return state;
    }

    function checkForSet(set) {
        const jokerValue = cards.getJokerValue(state.joker);
        const cardsWithoutJoker = set.filter(card => card.suit !== 4 && card.rank !== jokerValue);
        return new Set(cardsWithoutJoker.map(c => c.rank)).size === 1;
    }

    function play(currentUserId) {
        let newState = clone(state);
        const activeHandCards = cards.getActiveHandCards();

        if(activeHandCards.length === 2) {
            // Minimum 3 cards should be a set.
            return false;
        }

        if (activeHandCards.length > 2) {
            const activeCardObjects = cards.getCardObjects(activeHandCards);
            const isSet = checkForSet(activeCardObjects, state.joker);
            if (!isSet) {
                return false;
            }
        }

        newState.activePlayDeck = activeHandCards;

        let currentUser = newState.users.find(u => u.id === currentUserId);
        currentUser.hand = currentUser.hand.filter(c => !newState.activePlayDeck.includes(c));

        updateState(newState);
        network.broadcastGameState(state);
    }

    function draw(currentUserId) {
        let newState = clone(state);
        const currentUser = newState.users.find(u => u.id === currentUserId);
        const drawableCard = cards.getDrawableCard();
        currentUser.hand.push(drawableCard);
        newState.previousPlayDeck = clone(state.activePlayDeck);
        newState.activePlayDeck = [];
        newState.deck = state.deck.filter(c => c !== drawableCard);
        cards.clearDrawableCard();
        updateState(newState);
        console.table(state.users);
        network.broadcastGameState(state);
    }

    function render(currentUserId) {
        cards.unmountAllCards();

        if (!deck) {
            deck = cards.newDeck(false);
        }

        cards.mountHandCards(deck, state, currentUserId);
        cards.mountJoker(deck, state);
        cards.mountPlayCards(deck, state);
        cards.mountPreviousPlayerCards(deck, state);
        cards.mountDeck(deck, state);
    }

    return {
        getState,
        start,
        updateState,
        registerUser,
        render,
        play,
        draw
    }
}

export default game;