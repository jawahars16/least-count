import game from './index'
import cards from './cards'

let gameObj;
let gameState;
let handCards = [{i: 1, isActive: true}];

const mockNetwork = {
    broadcastGameState: jest.fn()
};

jest.mock('./cards', () => {
    return function () {

        const getActiveHandCards = jest.fn();
        getActiveHandCards.mockReturnValue([{i: 5}]);

        return {
            getActiveHandCards,
            getDrawableCard: () => ({i: 7}),
            setAllHandCardsInactive: jest.fn(),
            clearDrawableCard: jest.fn()
        }
    };
});

beforeEach(() => {
    gameObj = game(mockNetwork);
    gameState = {
        deck: [1, 2, 3],
        users: [{
            username: 'user 1',
            id: 1,
            hand: [4, 5, 6]
        }],
        activePlayDeck: [],
        previousPlayDeck: [7, 8],
        joker: 9
    };
});

test('play', function () {
    gameObj.play(1);
    const state = gameObj.getState();
    expect(state.activePlayDeck).toEqual([5]);
    expect(state.previousPlayDeck).toEqual([7, 8]);
    expect(state.users[0].hand).toEqual([4, 6]);
    expect(state.deck).toEqual([1, 2, 3]);
    expect(state.joker).toEqual(9);
});

test('draw', function () {
    gameObj.updateState({...gameState, activePlayDeck: [9, 10]})
    gameObj.draw(1);
    const state = gameObj.getState();
    expect(state.activePlayDeck).toEqual([]);
    expect(state.previousPlayDeck).toEqual([9, 10]);
    expect(state.users[0].hand).toEqual([4, 5, 6, 7]);
    expect(state.deck).toEqual([1, 2, 3]);
    expect(state.joker).toEqual(9);
});