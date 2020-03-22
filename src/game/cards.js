import Deck from 'deck-of-cards';
import $ from "jquery";
import options from "./options";

function cards() {
    let deck;

    let handCards;
    let drawableCard;
    let deckCards;
    let activeCards;
    let previousPlayerCards;
    let handCardClickHandler;
    let prevPlayCardClickHandler;
    let deckCardClickHandler;
    let handCardSubscribed = false;
    let prevPlayCardSubscribed = false;
    let deckCardSubscribed = false;

    function onCardClick(e) {
        e.currentTarget.classList.toggle('active');
    }

    function mountCards(cards, container) {
        cards.forEach(card => mountCard(card, container));
    }

    function mountCard(card, container) {
        card.mount(document.getElementById(container));
    }

    function unmountCards(cards) {
        if (cards) {
            cards.forEach(card => {
                $(card.$el).off('click', onCardClick);
                card.unmount();
            });
        }
    }

    function unmountAllCards() {
        unmountCards(handCards);
        unmountCards(previousPlayerCards);
        unmountCards(deckCards);
        unmountCards(activeCards);
    }

    function mountHandCards(deck, state, currentUserId) {

        const currentUserHand = state.users.find(u => currentUserId === u.id).hand;
        if (!currentUserHand || currentUserHand.length <= 0) {
            return;
        }
        handCards = deck.cards.filter(c => currentUserHand.includes(c.i));
        mountCards(handCards, options.handContainerId);

        handCards.forEach(handCard => {
            handCard.setSide('front');
            handCard.$el.setAttribute('data-id', handCard.i);
            $(handCard.$el).off('click', onCardClick).on('click', onCardClick);
        });
        handCardSubscribed = true;
    }

    function mountPreviousPlayerCards(deck, state) {
        previousPlayerCards = deck.cards.filter(c => state.previousPlayDeck.includes(c.i));
        mountCards(previousPlayerCards, options.previousPlayerAreaContainerId);

        previousPlayerCards.forEach(previousPlayerCard => {
            previousPlayerCard.setSide('front');
            previousPlayerCard.$el.setAttribute('data-id', previousPlayerCard.i);
            $(previousPlayerCard.$el).off('click', onCardClick).on('click', onCardClick);
        });
        prevPlayCardSubscribed = true;
    }

    function mountJoker(deck, state) {
        const jokerCard = deck.cards.find(c => c.i === state.joker);
        jokerCard.setSide('front');
        mountCard(jokerCard, options.jokerContainerId);
    }

    function mountDeck(deck, state) {
        deckCards = deck.cards.filter(c => state.deck.includes(c.i));
        mountCards(deckCards, options.deckContainerId);

        deckCards.forEach(deckCard => {
            deckCard.setSide('back');
            deckCard.$el.setAttribute('data-id', deckCard.i);
            $(deckCard.$el).off('click', onCardClick).on('click', onCardClick);
        });
        deckCardSubscribed = true;
    }

    function mountPlayCards(deck, state) {
        activeCards = deck.cards.filter(c => state.activePlayDeck.includes(c.i));
        mountCards(activeCards, options.playAreaContainerId);
        activeCards.forEach(activeCard => {
            activeCard.setSide('front');
            // activeCard.$el.removeEventListener('click', handCardClickHandler, false);
        });
    }

    function getActiveHandCards() {
        return $('#hand .card.active').map((i, card) => card.getAttribute('data-id') | 0).toArray();
    }

    function setAllHandCardsInactive() {
        handCards.forEach(c => c.isActive = false);
    }

    function newDeck(shuffle) {
        deck = Deck(true);
        if (shuffle) {
            deck.shuffle();
        }
        return deck;
    }

    function getDrawableCard() {
        let drawableCard = $('#prev-play-area .card.active').map((i, card) => card.getAttribute('data-id') | 0).toArray();
        if (drawableCard.length <= 0) {
            drawableCard = $('#deck .card.active').map((i, card) => card.getAttribute('data-id') | 0).toArray();
        }
        return drawableCard[0];
    }

    function getCardObjects(ids) {
        return deck.cards.filter(card => ids.includes(card.i));
    }

    function clearDrawableCard() {
        drawableCard = null;
    }
    
    function getJokerValue(jokerId) {
        return deck.cards.find(card => card.i === jokerId).rank;
    }

    return {
        newDeck,
        mountPreviousPlayerCards,
        mountDeck,
        mountHandCards,
        mountJoker,
        mountPlayCards,
        handCards,
        unmountAllCards,
        getActiveHandCards,
        setAllHandCardsInactive,
        getDrawableCard,
        clearDrawableCard,
        getCardObjects,
        getJokerValue
    }
}

export default cards;