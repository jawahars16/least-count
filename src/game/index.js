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
        activePlayer: null,
        previousPlayer: null
    };
    let deck;
    let cards = Cards();

    function clone(source) {
        return JSON.parse(JSON.stringify(source));
    }

    function start() {
        let newState = clone(state);
        newState.isActive = true;
        newState.activePlayer = null;
        newState.previousPlayer = null;
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

    function declare() {
        calculatePoints(state);
        network.broadcastDeclare(state);
    }

    function registerUser(user) {
        network.broadCastNewUser(user);
    }

    function calculatePoints(stateObj) {
        const jokerValue = cards.getJokerValue(state.joker);
        stateObj.users.forEach(user => {
            user.points = 0;
            if (user.hand && user.hand.length > 0) {
                const userHandCards = cards.getCardObjects(user.hand);
                const cardsWithoutJoker = userHandCards.filter(card => card.suit !== 4 && card.rank !== jokerValue);
                user.points = cardsWithoutJoker.map(c => c.rank > 10 ? 10 : c.rank).reduce((c1, c2) => c1 + c2);
            }
        });
    }

    function updateState(stateObj) {
        state = JSON.parse(JSON.stringify(stateObj));
    }

    function getState() {
        return state;
    }

    function isConsecutive(numbers) {
        for (let i = 0; i < numbers.length; i++) {
            const number = numbers[i];

            if (i === numbers.length - 1) {
                return true;
            }

            if (number + 1 !== numbers[i + 1]) {
                return false;
            }
        }

        return true;
    }


    function isConsecutiveWithJokers(numbers, jokersCount) {
        let holes = 0;
        numbers.sort((a, b) => b - a);
        for (let i = 0; i < numbers.length - 1; i++) {
            const number = numbers[i];
            holes += (number - numbers[i + 1] - 1);
        }

        return holes === jokersCount;
    }

    function checkForSet(set, jokerValue) {
        const cardsWithoutJoker = set.filter(card => card.suit !== 4 && card.rank !== jokerValue);

        // Check for sequence set.
        if (new Set(cardsWithoutJoker.map(c => c.rank)).size <= 1) {
            return true;
        }

        // No sequence set
        const sequence = cardsWithoutJoker.sort((card1, card2) => card1.rank - card2.rank);
        if (sequence.every(card => card.suit === sequence[0].suit)) {

            let numbers = sequence.map(s => s.rank);
            if (isConsecutive(numbers)) {
                return true;
            }

            const jokersCount = set.length - cardsWithoutJoker.length;
            return !!isConsecutiveWithJokers(numbers, jokersCount);
        }
    }

    function checkForMatchingCardsWithPreviousPlayedDeck(cardsWithoutJoker, prevPlayedCardsWithoutJoker) {
        const cardsWithoutJokerRanks = cardsWithoutJoker.map(c => c.rank);
        const prevPlayedCardsWithoutJokerRanks = prevPlayedCardsWithoutJoker.map(c => c.rank);

        return cardsWithoutJokerRanks.some(card => prevPlayedCardsWithoutJokerRanks.includes(card))
    }

    function play(currentUserId) {
        let newState = clone(state);
        const activeHandCards = cards.getActiveHandCards();

        if (activeHandCards.length === 2 || activeHandCards.length <= 0) {
            // Minimum 3 cards should be a set.
            return false;
        }

        const activeCardObjects = cards.getCardObjects(activeHandCards);
        const jokerValue = cards.getJokerValue(state.joker);

        if (activeHandCards.length > 2) {
            const isSet = checkForSet(activeCardObjects, jokerValue);
            if (!isSet) {
                return false;
            }
        }

        let currentUser = newState.users.find(u => u.id === currentUserId);
        const prevPlayedCards = cards.getCardObjects(state.previousPlayDeck);

        const cardsWithoutJoker = activeCardObjects.filter(card => card.suit !== 4 && card.rank !== jokerValue);
        const prevPlayedCardsWithoutJoker = prevPlayedCards.filter(card => card.suit !== 4 && card.rank !== jokerValue);

        // If the cards played user matched with any cards played previously,
        // then player dont have to draw new cards. 😻
        if (checkForMatchingCardsWithPreviousPlayedDeck(cardsWithoutJoker, prevPlayedCardsWithoutJoker)) {
            newState.previousPlayDeck = activeHandCards;
            newState.activePlayDeck = [];
            currentUser.hand = currentUser.hand.filter(c => !newState.previousPlayDeck.includes(c));
        } else {
            newState.activePlayDeck = activeHandCards;
            currentUser.hand = currentUser.hand.filter(c => !newState.activePlayDeck.includes(c));
        }

        currentUser.hand = currentUser.hand.filter(c => !newState.activePlayDeck.includes(c));

        updateState(newState);
        network.broadcastGameState(state);
    }

    function draw(currentUserId) {
        const drawableCard = cards.getDrawableCard();
        console.log(drawableCard);
        if (!drawableCard) {
            return;
        }

        let newState = clone(state);
        const currentUser = newState.users.find(u => u.id === currentUserId);

        currentUser.hand.push(drawableCard);
        newState.previousPlayDeck = clone(state.activePlayDeck);
        newState.activePlayDeck = [];
        newState.deck = state.deck.filter(c => c !== drawableCard);
        cards.clearDrawableCard();
        updateState(newState);
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
        draw,
        checkForSet,
        declare
    }
}

export default game;