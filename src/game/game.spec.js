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
        getActiveHandCards.mockReturnValue([5]);

        return {
            getActiveHandCards,
            getDrawableCard: () => (7),
            setAllHandCardsInactive: jest.fn(),
            clearDrawableCard: jest.fn(),
            getJokerValue: () => 9
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
            hand: [4, 5, 6, 9, 10]
        }],
        activePlayDeck: [],
        previousPlayDeck: [7, 8],
        joker: 9
    };
});

test('play', function () {
    gameObj.updateState({...gameState});
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
    expect(state.users[0].hand).toEqual([4, 5, 6, 9, 10, 7]);
    expect(state.deck).toEqual([1, 2, 3]);
    expect(state.joker).toEqual(9);
});

test('check for set - same number sequence without joker', function () {
    gameObj.updateState({...gameState});
    const isSet = gameObj.checkForSet([
        {rank: 4, suit: 1},
        {rank: 4, suit: 2},
        {rank: 4, suit: 3}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - same number sequence with joker', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 4, suit: 1},
        {rank: 4, suit: 2},
        {rank: 9, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - same number sequence with actual joker', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 4, suit: 1},
        {rank: 4, suit: 2},
        {rank: 0, suit: 4}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - same number sequence with all actual jokers', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 4},
        {rank: 1, suit: 4},
        {rank: 0, suit: 4}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - same number sequence with all jokers', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 9, suit: 1},
        {rank: 9, suit: 2},
        {rank: 9, suit: 3}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - same number sequence with 2 jokers', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 9, suit: 1},
        {rank: 9, suit: 2},
        {rank: 1, suit: 3}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - sequence', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 4, suit: 1},
        {rank: 5, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - sequence unsorted', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 9, suit: 1},
        {rank: 7, suit: 1},
        {rank: 8, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - sequence with different kind', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 4, suit: 1},
        {rank: 5, suit: 2}
    ]);
    expect(isSet).toBeFalsy();
});

test('check for set - sequence with jokers', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 4, suit: 1},
        {rank: 9, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - sequence with actual jokers', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 4, suit: 1},
        {rank: 9, suit: 4}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - sequence with joker in between', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 9, suit: 3},
        {rank: 5, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});

test('check for set - false sequence with joker in between', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 9, suit: 1},
        {rank: 6, suit: 1}
    ]);
    expect(isSet).toBeFalsy();
});

test('check for set - sequence with 2 jokers in between', function () {
    gameObj.updateState({...gameState, joker: 9});
    const isSet = gameObj.checkForSet([
        {rank: 3, suit: 1},
        {rank: 9, suit: 1},
        {rank: 4, suit: 1},
        {rank: 5, suit: 1}
    ]);
    expect(isSet).toBeTruthy();
});